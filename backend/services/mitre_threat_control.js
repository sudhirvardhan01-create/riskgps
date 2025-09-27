const { sequelize, MitreThreatControl, ThreatBundle } = require("../models");
const { Op } = require("sequelize");
const CustomError = require("../utils/CustomError");
const HttpStatus = require("../constants/httpStatusCodes");
const Messages = require("../constants/messages");
const { ASSETS, GENERAL } = require("../constants/library");
const { format } = require("@fast-csv/format");
const QueryStream = require("pg-query-stream");
const fs = require("fs");
const { parse } = require("fast-csv");
const { v4: uuidv4 } = require("uuid");
const { createdDate } = require("../models/common_fields");
class MitreThreatControlService {
    static async createMitreThreatControlRecord(data) {
        return await sequelize.transaction(async (t) => {
            console.log(
                "[createMitreThreatControlRecord] Creating mitre threat control",
                data
            );
            this.validateMitreThreatControlData(data);
            const controls = data.controls ?? [];
            const payloads = controls.map((control) => ({
                platforms: data.platforms,
                mitreTechniqueId: data.mitreTechniqueId,
                mitreTechniqueName: data.mitreTechniqueName,
                ciaMapping: data.ciaMapping,
                subTechniqueId: data.subTechniqueId ?? null,
                subTechniqueName: data.subTechniqueName ?? null,
                mitreControlId: control.mitreControlId,
                mitreControlName: control.mitreControlName,
                mitreControlType: control.mitreControlType,
                mitreControlDescription: control.mitreControlDescription,
                controlPriority: control.controlPriority,
                bluOceanControlDescription: control.bluOceanControlDescription,
                status: data.status ?? "published",
            }));
            const mitreThreatControlRecord = await MitreThreatControl.bulkCreate(
                payloads,
                {
                    transaction: t,
                }
            );
            console.log(mitreThreatControlRecord.length);
            return true;
        });
    }
    static async getAllMitreTheatControlRecords(
        page = 0,
        limit = 6,
        searchPattern = null,

        sortBy = "created_at",
        sortOrder = "ASC"
    ) {
        const offset = page * limit;
        if (!ASSETS.ASSET_ALLOWED_SORT_FILED.includes(sortBy)) {
            sortBy = "created_at";
        }
        if (!GENERAL.ALLOWED_SORT_ORDER.includes(sortOrder)) {
            sortOrder = "ASC";
        }
        const whereClause = this.handleMitreThreatControlFilters(searchPattern);
        const data = await MitreThreatControl.findAll({
            order: [[sortBy, sortOrder]],
            where: whereClause,
        });
        const grouped = Object.values(
            data.reduce((acc, row) => {
                const key =
                    row.mitreTechniqueId +
                    (row.subTechniqueId ? "." + row.subTechniqueId : "");
                if (!acc[key]) {
                    acc[key] = {
                        id: row.id,
                        platforms: row.platforms,
                        mitreTechniqueId: row.mitreTechniqueId,
                        mitreTechniqueName: row.mitreTechniqueName,
                        ciaMapping: row.ciaMapping,
                        subTechniqueId: row.subTechniqueId,
                        subTechniqueName: row.subTechniqueName,
                        controls: [],
                        status: row.status,
                        created_at: row.created_at,
                        updated_at: row.updated_at,
                    };
                }
                acc[key].controls.push({
                    mitreControlId: row.mitreControlId,
                    mitreControlName: row.mitreControlName,
                    mitreControlType: row.mitreControlType,
                    controlPriority: row.controlPriority,
                    mitreControlDescription: row.mitreControlDescription,
                    bluOceanControlDescription: row.bluOceanControlDescription,
                });
                return acc;
            }, {})
        );
        const total = grouped.length;
        const totalPages = Math.ceil(total / limit);
        // slice based on zero-indexed page
        const start = page * limit;

        const end = start + limit;
        const paginatedData = grouped.slice(start, end);
        return {
            data: paginatedData,
            total,
            page,
            limit,
            totalPages,
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
    static async updateMitreThreatControlRecord(
        mitreTechniqueId,
        subTechniqueId,
        data
    ) {
        if (!mitreTechniqueId) {
            throw new CustomError(
                Messages.MITRE_THREAT_CONTROL.INVALID_MITRE_TECHNIQUE_ID_REQUIRED,
                HttpStatus.BAD_REQUEST
            );
        }
        return await sequelize.transaction(async (t) => {
            console.log(
                "[updateMitreThreatControlRecord] Updating mitre threat control",
                data
            );
            this.validateMitreThreatControlData(data);
            const whereClause = { mitreTechniqueId };
            if (subTechniqueId !== null) {
                whereClause.subTechniqueId = subTechniqueId;
            } else {
                whereClause.subTechniqueId = {
                    [Op.or]: [null, ""],
                };
            }
            const deletedCount = await MitreThreatControl.destroy({

                where: whereClause,
            });
            console.log(deletedCount);
            const controls = data.controls ?? [];
            const payloads = controls.map((control) => ({
                platforms: data.platforms,
                mitreTechniqueId: mitreTechniqueId,
                mitreTechniqueName: data.mitreTechniqueName,
                ciaMapping: data.ciaMapping,
                subTechniqueId: subTechniqueId ?? null,
                subTechniqueName: data.subTechniqueName ?? null,
                mitreControlId: control.mitreControlId,
                mitreControlName: control.mitreControlName,
                mitreControlType: control.mitreControlType,
                controlPriority: row.controlPriority,
                mitreControlDescription: control.mitreControlDescription,
                bluOceanControlDescription: control.bluOceanControlDescription,
                status: data.status ?? "published",
            }));
            const mitreThreatControlRecord = await MitreThreatControl.bulkCreate(
                payloads,
                {
                    transaction: t,
                }
            );
            if (mitreThreatControlRecord === 0) {
                throw new CustomError(
                    "Element not found with ID",
                    HttpStatus.BAD_REQUEST
                );
            }
            return data;
        });
    }
    static async deleteMitreThreatControlRecordById(
        mitreTechniqueId,
        mitreSubTechniqueId = null
    ) {
        if (!mitreTechniqueId) {
            throw new CustomError(
                Messages.MITRE_THREAT_CONTROL.INVALID_MITRE_TECHNIQUE_ID_REQUIRED,
                HttpStatus.BAD_REQUEST
            );
        }
        const whereClause = { mitreTechniqueId };
        if (mitreSubTechniqueId !== null) {
            whereClause.subTechniqueId = mitreSubTechniqueId;
        } else {
            whereClause.subTechniqueId = {
                [Op.or]: [null, ""],
            };

        }
        const deletedCount = await MitreThreatControl.destroy({
            where: whereClause,
        });
        if (deletedCount === 0) {
            console.log(
                "[deleteMitreThreatControlRecordById] Not found:",
                whereClause
            );
            throw new CustomError(
                Messages.MITRE_THREAT_CONTROL.NOT_FOUND,
                HttpStatus.NOT_FOUND
            );
        }
        return { data: deletedCount };
    }
    static async updateMitreThreatControlStatus(
        mitreTechniqueId,
        subTechniqueId = null,
        status
    ) {
        if (!GENERAL.STATUS_SUPPORTED_VALUES.includes(status)) {
            console.log("[updateMitreThreatControlStatus] Invalid status:", status);
            throw new CustomError(
                Messages.MITRE_THREAT_CONTROL.INVALID_STATUS,
                HttpStatus.BAD_REQUEST
            );
        }
        const whereClause = { mitreTechniqueId };
        if (subTechniqueId !== null) {
            whereClause.subTechniqueId = subTechniqueId;
        } else {
            whereClause.subTechniqueId = {
                [Op.or]: [null, ""],
            };
        }
        const [updatedRowsCount] = await MitreThreatControl.update(
            { status },
            { where: whereClause }
        );
        console.log(updatedRowsCount);
        if (updatedRowsCount === 0) {
            console.log(
                "[updateProcessStatus] No mitre threat control recorod found:",
                mitreTechniqueId,
                subTechniqueId
            );
            throw new CustomError(

                Messages.MITRE_THREAT_CONTROL.NOT_FOUND,
                HttpStatus.NOT_FOUND
            );
        }
        console.log(
            "[updateProcessStatus] Status updated successfully:",
            mitreTechniqueId,
            subTechniqueId
        );
        return { message: Messages.PROCESS.STATUS_UPDATED };
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
            Platforms:
                "List of platforms separated by comma from the list" +
                ASSETS.ASSET_CATEGORY.join(","),
            "Mitre Technique Id": "Technique ID from Mitre",
            "Mitre Technique Name": "Technique Name from Mitre",
            "CIA Mapping": "List separated by , eg: C,I,A",
            "SubTechnique ID": "ID of the Sub Technique from Mitre",
            "SubTechnique Name": "Name of the Sub Technique from Mitre",
            "Mitre Control ID": "Mite Control ID",
            "Mitre Control Name": "Mite Control name",
            "Mitre Control Type": "Mite Control type",
            "Control Priority": "Control Priority",
            "Mitre Control Description": "Mitre Control Description",
            "BluOcean Control Description": "BluOcean Control Description text",
        });
        csvStream.end();
    }
    static async importMitreThreatControlRecordFromCSV(filePath) {
        function parsePlatforms(value) {
            if (!value) return [];
            return value
                .split(",")
                .map((v) => v.trim())
                .filter((v) => ASSETS.ASSET_CATEGORY.includes(v));
        }
        function parseCIAMapping(value) {
            if (!value) return [];
            return value
                .split(",")
                .map((v) => v.trim())

                .filter((v) => GENERAL.CIA_MAPPING_VALUES.includes(v));
        }
        return new Promise((resolve, reject) => {
            const grouped = {};
            fs.createReadStream(filePath)
                .pipe(parse({ headers: true }))
                .on("error", (error) => reject(error))
                .on("data", (row) => {
                    // Build the key (all fields except platforms)
                    const key = JSON.stringify({
                        mitreTechniqueId: row["Mitre Technique Id"],
                        mitreTechniqueName: row["Mitre Technique Name"],
                        ciaMapping: parseCIAMapping(row["CIA Mapping"]),
                        subTechniqueId: row["SubTechnique ID"],
                        subTechniqueName: row["SubTechnique Name"],
                        mitreControlId: row["Mitre Control ID"],
                        mitreControlName: row["Mitre Control Name"],
                        mitreControlType: row["Mitre Control Type"],
                        controlPriority: row["Control Priority"],
                        mitreControlDescription: row["Mitre Control Description"],
                        bluOceanControlDescription: row["BluOcean Control Description"],
                        status: "published",
                    });
                    if (!grouped[key]) {
                        grouped[key] = { ...JSON.parse(key), platforms: [] };
                    }
                    // Merge platforms incrementally
                    console.log(parsePlatforms(row["Platforms"]));
                    grouped[key].platforms = [
                        ...new Set([
                            ...grouped[key].platforms,
                            ...parsePlatforms(row["Platforms"]),
                        ]),
                    ];
                })
                .on("end", async () => {
                    try {
                        const finalRows = Object.values(grouped);
                        await MitreThreatControl.bulkCreate(finalRows, {
                            ignoreDuplicates: true,
                        });
                        fs.unlinkSync(filePath);
                        resolve(finalRows);
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
            res.setHeader(
                "Content-disposition",
                "attachment; filename=mitre_control_threats_export.csv"
            );
            res.setHeader("Content-Type", "text/csv");
            const csvStream = format({
                headers: true,
                transform: (row) => ({
                    "Mitre Threat Control ID": row.id,
                    Platforms: row.platforms ? row.platforms.join(", ") : "",
                    "Mitre Technique Id": row.mitre_technique_id,
                    "Mitre Technique Name": row.mitre_technique_name,
                    "CIA Mapping": row.cia_mapping,
                    "SubTechnique ID": row.sub_technique_id,
                    "SubTechnique Name": row.sub_technique_name,
                    "Mitre Control ID": row.mitre_control_id,
                    "Mitre Control Name": row.mitre_control_name,
                    "Mitre Control Type": row.mitre_control_type,
                    "Control Priority": row.controlPriority,
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
        const { platforms, controls, ciaMapping } = data;
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
        if (!controls || controls.length < 1) {
            throw new CustomError(
                Messages.MITRE_THREAT_CONTROL.INVALID_CONTROLS_LIST_FOR_THREAT,
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
                ],
            });
        }
        return conditions.length > 0 ? { [Op.and]: conditions } : {};
    }
    /**
    * Create threat bundle records
    * @param {Object} data
    */
    static async createThreatBundleRecords(data) {
        return await sequelize.transaction(async (t) => {
            this.validateThreatBundleData(data);
            const mitreThreatTechniques = data.mitreThreatTechnique ?? [];
            const payload = mitreThreatTechniques.map((row) => ({
                threatBundleId: uuidv4(),
                threatBundleName: data.threatBundleName,
                mitreTechniqueId: row.mitreTechniqueId,
                mitreTechniqueName: row.mitreTechniqueName,
                status: "published",
                createdDate: new Date(),
                modifiedDate: new Date(),
                isDeleted: false,
            }));
            const threatBundleRecords = await ThreatBundle.bulkCreate(payload, {
                transaction: t,
            });
            return true;
        });
    }

    /**
    * Get Threat Bundle Records
    * @param {String} bundleName
    * @param {Number} page
    * @param {Number} limit
    */
    static async getAllThreatBundleRecords(bundleName, page = 0, limit = 6) {
        const whereClause = this.handleThreatBundlesFilters(bundleName);
        const data = await ThreatBundle.findAll({
            where: whereClause,
            order: [["created_date", "ASC"]],
        });
        const total = data.length;
        const totalPages = Math.ceil(total / limit);
        const start = page * limit;
        const end = start + limit;
        const paginatedData = data.slice(start, end);
        const result = {
            threatBundleName: paginatedData[0]?.threatBundleName,
            mitreThreatTechnique: paginatedData.map((row) => ({
                threatBundleId: row.threatBundleId,
                mitreTechniqueId: row.mitreTechniqueId,
                mitreTechniqueName: row.mitreTechniqueName,
                status: row.status,
                createdDate: row.createdDate ?? "",
                modifiedDate: row.modifiedDate ?? "",
            })),
        };
        return {
            data: result,
            total,
            page,
            limit,
            totalPages,
        };
    }
    /**
    * Delete Threat Bundle Record
    * @param {string} threatBundleId
    */
    static async deleteThreatBundleRecord(threatBundleId) {
        if (!threatBundleId) {
            throw new Error("Invalid: Request Id required");
        }
        const whereClause = { threatBundleId };
        const deletedCount = await ThreatBundle.destroy({ where: whereClause });
        if (deletedCount < 1) {
            throw new CustomError("Record not found", HttpStatus.NOT_FOUND);
        }
        return { message: "Record deleted successfully" };
    }
    static handleThreatBundlesFilters(bundleName = null) {

        let conditions = [];
        if (bundleName) {
            conditions.push({
                threatBundleName: bundleName,
            });
        }
        return conditions.length > 0 ? { [Op.and]: conditions } : {};
    }
    static validateThreatBundleData(data) {
        const { threatBundleName, mitreThreatTechnique } = data;
        if (!threatBundleName) {
            throw new CustomError(
                "Threat Bundle Name is Required",
                HttpStatus.NOT_FOUND
            );
        }
        if (!mitreThreatTechnique || mitreThreatTechnique.length < 1) {
            throw new CustomError(
                "MITRE Technique ID and Name are required",
                HttpStatus.NOT_FOUND
            );
        }
    }
}
module.exports = MitreThreatControlService;