const { sequelize, MitreThreatControl } = require("../models");
const { Op } = require("sequelize");
const CustomError = require("../utils/CustomError");
const HttpStatus = require("../constants/httpStatusCodes");
const Messages = require("../constants/messages");
const { ASSETS, GENERAL } = require("../constants/library");
const { format } = require("@fast-csv/format");
const QueryStream = require("pg-query-stream");
const fs = require("fs");
const { parse } = require("fast-csv");

class MitreThreatControlService {

    static async createMitreThreatControlRecord(data) {
        return await sequelize.transaction(async (t) => {
            console.log("[createAsset] Creating asset", data);

            this.validateMitreThreatControlData(data);

            const mitreThreatControlRecord = MitreThreatControl.create(assetData, {
                transaction: t,
            });

            return mitreThreatControlRecord;
        });
    }

    static async getAllMitreTheatControlRecords(
        page = 0,
        limit = 6,
        searchPattern = null,
        sortBy = "created_at",
        sortOrder = "ASC",
    ) {
        const offset = page * limit;

        if (!ASSETS.ASSET_ALLOWED_SORT_FILED.includes(sortBy)) {
            sortBy = "created_at";
        }

        if (!GENERAL.ALLOWED_SORT_ORDER.includes(sortOrder)) {
            sortOrder = "ASC";
        }

        const whereClause = this.handleMitreThreatControlFilters(searchPattern);

        const total = await MitreThreatControl.count({
            where: whereClause,
        });
        const mitreThreatControl = await MitreThreatControl.findAll({
            limit,
            offset,
            order: [[sortBy, sortOrder]],
            where: whereClause,
        });

        return {
            data: mitreThreatControl,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    static async getMitreThreatControlRecordById(id) {
        const mitreThreatControl = await MitreThreatControl.findByPk(id);
        console.log(mitreThreatControl);

        if (!mitreThreatControl) {
            console.log("Mitre Threat Control Record not found with id", id);
            throw new CustomError(
                Messages.MITRE_THREAT_CONTROL.NOT_FOUND(id),
                HttpStatus.NOT_FOUND
            );
        }

        return mitreThreatControl;
    }

    static async deleteMitreThreatControlRecordById(id) {
        const mitreThreatControl = await MitreThreatControl.findByPk(id);

        if (!mitreThreatControl) {
            console.log("[deleteMitreThreatControlRecordById] Not found:", id);
            throw new CustomError(
                Messages.MITRE_THREAT_CONTROL.NOT_FOUND(id),
                HttpStatus.NOT_FOUND
            );
        }

        await mitreThreatControl.destroy();
        return { message: Messages.MITRE_THREAT_CONTROL.DELETED };
    }

    static async downloadMitreThreatControlImportTemplateFile(res) {
        res.setHeader("Content-Type", "text/csv");
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=mitre_threat_controls_template.csv"
        );

        const csvStream = format({ headers: true });
        csvStream.pipe(res);

        // Row 1: Clarifications / Instructions
        csvStream.write({
            "Platforms": "List of platforms separated by comma from the list" + ASSETS.ASSET_CATEGORY.join(","),
            "Mitre Technique Id": "Technique ID from Mitre",
            "Mitre Technique Name": "Technique Name from Mitre",
            "CIA Mapping": "List separated by , eg: C,I,A",
            "SubTechnique ID": "ID of the Sub Technique from Mitre",
            "SubTechnique Name": "Name of the Sub Technique from Mitre",
            "Mitre Control ID": "Mite Control ID",
            "Mitre Control Name": "Mite Control name",
            "Mitre Control Type": "Mite Control type",
            "Mitre Control Description": "Mitre Control Description",
            "BluOcean Control Description": "BluOcean Control Description text",
        });

        csvStream.end();
    }

    static async importMitreThreatControlRecordFromCSV(filePath) {

        function parsePlatforms(value) {
            if (!value) return [];
            return value
                .split(",") // split by comma
                .map((v) => v.trim()) // remove whitespace
                .filter((v) => ASSETS.ASSET_CATEGORY.includes(v));
        }

        function parseCIAMapping(value) {
            if (!value) return [];
            return value
                .split(",") // split by comma
                .map((v) => v.trim()) 
                .filter((v) => GENERAL.CIA_MAPPING_VALUES.includes(v)); 

        }

        return new Promise((resolve, reject) => {
            const rows = [];

            fs.createReadStream(filePath)
                .pipe(parse({ headers: true }))
                .on("error", (error) => reject(error))
                .on("data", (row) => {
                    rows.push({
                        platforms: parsePlatforms(row["Platforms"]),
                        mitreTechniqueId: row["Mitre Technique Id"],
                        mitreTechniqueName: row["Mitre Technique Name"],
                        ciaMapping: parseCIAMapping(row["CIA Mapping"]),
                        subTechniqueId: row["SubTechnique ID"],
                        subTechniqueName: row["SubTechnique Name"],
                        mitreControlId: row["Mitre Control ID"],
                        mitreControlName: row["Mitre Control Name"],
                        mitreControlType: row["Mitre Control Type"],
                        mitreControlDescription: row["Mitre Control Description"],
                        bluOceanControlDescription: row["BluOcean Control Description"],
                        status: "published",
                    });
                })
                .on("end", async () => {
                    try {
                        await MitreThreatControl.bulkCreate(rows, { ignoreDuplicates: true });
                        fs.unlinkSync(filePath);
                        resolve(rows.length);
                    } catch (err) {
                        reject(err);
                    }
                });
        });
    }

    static async exportMitreThreatControlCSV(res) {
        const connection = await sequelize.connectionManager.getConnection();

        try {
            const sql = `
            SELECT *
            FROM library_mitre_threats_controls
            ORDER BY created_at DESC
            `;

            const query = new QueryStream(sql);
            const stream = connection.query(query);

            res.setHeader("Content-disposition", "attachment; filename=mitre_control_threats_export.csv");
            res.setHeader("Content-Type", "text/csv");

            const csvStream = format({
                headers: true,
                transform: (row) => ({
                    "Mitre Threat Control ID": row.id,
                    "Platforms": row.platforms ? row.platforms.join(", ") : "",
                    "Mitre Technique Id": row.mitre_technique_id,
                    "Mitre Technique Name": row.mitre_technique_name,
                    "CIA Mapping": row.cia_mapping,
                    "SubTechnique ID": row.sub_technique_id,
                    "SubTechnique Name": row.sub_technique_name,
                    "Mitre Control ID": row.mitre_control_id,
                    "Mitre Control Name": row.mitre_control_name,
                    "Mitre Control Type": row.mitre_control_type,
                    "Mitre Control Description": row.mitre_control_description,
                    "BluOcean Control Description": row.blu_ocean_control_description,
                    "Created At": row.created_at,
                    "Updated At": row.updated_at,
                }),
            });

            stream.on("end", () => {
                sequelize.connectionManager.releaseConnection(connection);
            });

            stream.pipe(csvStream).pipe(res);
        } catch (err) {
            sequelize.connectionManager.releaseConnection(connection);
            throw new Error(err);
        }
    }

    static validateMitreThreatControlData(data) {
        const {
            mitreThreatControlId,
            platforms,
            mitreTechniqueId,
            mitreTechniqueName,
            subTechniqueId,
            ciaMapping,
            subTechniqueName,
            mitreControlType,
        } = data;

        if (
            !platforms ||
            !Array.isArray(platforms) ||
            !platforms.every((p) => ASSETS.ASSET_CATEGORY.includes(p))
        ) {
            throw new CustomError(
                Messages.MITRE_THREAT_CONTROL.INVALID_PlATFORMS,
                HttpStatus.NOT_FOUND
            );
        }

        if (!ciaMapping || !Array.isArray(ciaMapping)) {
            throw new CustomError(
                Messages.MITRE_THREAT_CONTROL.INVALID_CIA_MAPPING,
                HttpStatus.NOT_FOUND
            );
        }
    }

    static handleMitreThreatControlFilters(
        searchPattern = null,
        statusFilter = [],
        attrFilters = []
    ) {
        let conditions = [];

        if (searchPattern) {
            conditions.push({
                [Op.or]: [
                    { mitreTechniqueName: { [Op.iLike]: `%${searchPattern}%` } },
                    { subTechniqueName: { [Op.iLike]: `%${searchPattern}%` } },
                    { mitreControlName: { [Op.iLike]: `%${searchPattern}%` } },
                ],
            });
        }
        return conditions.length > 0 ? { [Op.and]: conditions } : {};
    }
}

module.exports = MitreThreatControlService;
