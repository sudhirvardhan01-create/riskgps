const { format } = require("fast-csv");
const HttpStatusCodes = require("../constants/httpStatusCodes");
const Messages = require("../constants/messages");
const { sequelize, MitreThreatControl, FrameWorkControl, MitreFrameworkControlMappings } = require("../models");
const CustomError = require("../utils/CustomError");
const fs = require("fs");
const { parse } = require("fast-csv");
const { MITRE_CONTROLS, GENERAL, FRAMEWORK_CONTROLS } = require("../constants/library");
const { Op, where } = require("sequelize");


class ControlsService {
    static async getAllControl(
        page = 0,
        limit = 6,
        searchPattern = null,
        sortBy = "created_at",
        sortOrder = "ASC",
    ) {

        if (!MITRE_CONTROLS.ALLOWED_SORT_FILED.includes(sortBy)) {
            sortBy = "created_at";
        }

        if (!GENERAL.ALLOWED_SORT_ORDER.includes(sortOrder)) {
            sortOrder = "ASC";
        }
        const whereClause = this.handleControlsFilters(searchPattern);

        const includeRelation = { model: FrameWorkControl, as: 'framework_controls' }

        const data = await MitreThreatControl.findAll({
            order: [[sortBy, sortOrder]],
            where: whereClause,
            include: includeRelation
        });

        const grouped = Object.values(
            data.reduce((acc, row) => {
                const key = row.mitreControlId + row.mitreControlName;

                if (!acc[key]) {
                    acc[key] = {
                        id: row.id,
                        mitreControlId: row.mitreControlId,
                        mitreControlName: row.mitreControlName,
                        mitreControlType: row.mitreControlType,
                        subControls: [],
                        nistControls: [],
                        status: row.status,
                        created_at: row.created_at,
                        updated_at: row.updated_at,
                    };
                }

                // loop through framework_controls if present
                if (row.framework_controls && row.framework_controls.length > 0) {
                    row.framework_controls.forEach(fc => {
                        acc[key].nistControls.push({
                            id: fc.id,
                            frameWorkName: fc.frameWorkName,
                            frameWorkControlCategoryId: fc.frameWorkControlCategoryId,
                            frameWorkControlCategory: fc.frameWorkControlCategory,
                            frameWorkControlDescription: fc.frameWorkControlDescription,
                            frameWorkControlSubCategoryId: fc.frameWorkControlSubCategoryId,
                            frameWorkControlSubCategory: fc.frameWorkControlSubCategory
                        });
                    });
                }

                // push sub-control details
                acc[key].subControls.push({
                    id: row.id,
                    mitreTechniqueId: row.mitreTechniqueId,
                    mitreTechniqueName: row.mitreTechniqueName,
                    subTechniqueId: row.subTechniqueId,
                    subTechniqueName: row.subTechniqueName,
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

    static async deleteMitreControl(mitreControlId, mitreControlName) {
        const whereClause = { mitreControlId };

        if (mitreControlName !== null) {
            whereClause.mitreControlName = mitreControlName;
        } else {
            whereClause.mitreControlName = {
                [Op.or]: [null, '']
            };
        }

        const [deletedCount] = await MitreThreatControl.destroy({ where: whereClause });

        if (deletedCount === 0) {
            console.log("[deleteMitreControl] No mitre threat control recorod found:", mitreControlId, mitreControlName);
            throw new CustomError(Messages.MITRE_THREAT_CONTROL.NOT_FOUND, HttpStatus.NOT_FOUND);
        }

        console.log("[updateMitreControlStatus] Status updated successfully:", mitreControlId, mitreControlName);
        return { message: Messages.MITRE_CONTROLS.UPDATED_STATUS };
    }


    static async updateMitreControl(mitreControlId, mitreControlName, mitreControlType, data) {
        if (!mitreControlId || !mitreControlName) {
            console.log("Failed to update mitre Contol control id and name required")
            throw new CustomError("Failed to update mitre Contol control id and name required");
        }

        if (!data) {
            console.log("no update data found");
            throw new Error("no update data found");
        }

        if (!Array.isArray(data.subControls) || data.subControls.length < 1) {
            throw new Error("Invalid request, subcontrol required");
        }
        return await sequelize.transaction(async (t) => {
            const payload = {
                mitreControlId,
                mitreControlName,
                mitreControlType
            }
            const [mitreThreatControlUpdateCount] = await MitreThreatControl.update(
                payload,
                {
                    where: { mitreControlId: mitreControlId, mitreControlName: mitreControlName },
                    transaction: t
                }
            );
            if (!mitreThreatControlUpdateCount) {
                console.log("No mitre control record found:", mitreControlId, mitreControlName);
                throw new CustomError(Messages.MITRE_CONTROLS.NOT_FOUND, HttpStatus.NOT_FOUND);
            }

            this.validateMitreControlData(data);

            this.handleMitreControlsTechniqueMapping(mitreControlId, mitreControlName, data.subControls, t);

            console.log("Mitre Control updated successfully:", mitreControlId, mitreControlName);
        });

    }

    static async updateMitreControlStatus(mitreControlId, mitreControlName, status) {
        const whereClause = { mitreControlId };

        if (!status) {
            throw new Error("Status required");
        }

        if (mitreControlName !== null) {
            whereClause.mitreControlName = mitreControlName;
        } else {
            whereClause.mitreControlName = {
                [Op.or]: [null, '']
            };
        }

        const [updatedRowsCount] = await MitreThreatControl.update({ status }, { where: whereClause });

        if (updatedRowsCount === 0) {
            console.log("[updateMitreControlStatus] No mitre threat control recorod found:", mitreControlId, mitreControlName);
            throw new CustomError(Messages.MITRE_THREAT_CONTROL.NOT_FOUND, HttpStatus.NOT_FOUND);
        }

        console.log("[updateMitreControlStatus] Status updated successfully:", mitreControlId, mitreControlName);
        return { message: Messages.MITRE_CONTROLS.UPDATED_STATUS };
    }



    static async createFrameworkControl(data) {
        try {
            return await sequelize.transaction(async (t) => {
                console.log("[createFrameworkControl] create FrameworkControl", data);

                this.validateFrameworkControls(data);

                const frameworkControlData = this.handleFrameworkDataColumnMapping(data);
                console.log("Creating framework control with data:", frameworkControlData);

                const newControl = await FrameWorkControl.create(frameworkControlData, { transaction: t });

                await this.handleFrameworkControlToMitreControlsMapping(newControl.id, data.mitreControls, t);

                return true;
            });
        } catch (err) {
            console.error("[createFrameworkControl] Error:", err);
            throw err;
        }
    }

    static async getAllFrameworkControls(
        frameWorkName,
        page = 0,
        limit = 6,
        searchPattern = null,
        sortBy = "created_at",
        sortOrder = "ASC") {

        if (!FRAMEWORK_CONTROLS.ALLOWED_SORT_FILED.includes(sortBy)) {
            sortBy = "created_at";
        }

        if (!GENERAL.ALLOWED_SORT_ORDER.includes(sortOrder)) {
            sortOrder = "ASC";
        }

        const whereClause = this.handleFrameworkControlsFilters(frameWorkName, searchPattern);

        const data = await FrameWorkControl.findAll({
            where: whereClause,
            order: [[sortBy, sortOrder]],
            include: [
                {
                    model: sequelize.models.MitreThreatControl,
                    as: 'mitre_controls',   // must match the alias in your association
                    through: { attributes: [] } // exclude join table fields
                }
            ]
        });
        const controls = data.map((s) => s.toJSON());


        for (let i = 0; i < controls.length; i++) {
            const control = controls[i];
            const mitreControls = control.mitre_controls ?? []

            const uniqueMitreControlIds = [...new Set(mitreControls?.map(item => item.mitreControlId))];

            control.mitreControls = uniqueMitreControlIds;
            delete control.mitre_controls;
        }

        const total = controls.length;
        const totalPages = Math.ceil(total / limit);

        // slice based on zero-indexed page
        const start = page * limit;
        const end = start + limit;
        const paginatedData = controls.slice(start, end);

        return {
            data: paginatedData,
            total,
            page,
            limit,
            totalPages,
        };
    }

    static async updateFrameWorkControlStatus(status, id) {
        if (!status) {
            throw new Error("Status required")
        }

        if (!id) {
            throw new Error("Invalid request id required");
        }

        const whereClause = { id };


        const [updatedCount] = await FrameWorkControl.update({ status }, { where: whereClause });

        if (updatedCount < 1) {
            console.log("[deleteMitreControl] No mitre threat control recorod found:");
            throw new CustomError(Messages.MITRE_THREAT_CONTROL.NOT_FOUND, HttpStatus.NOT_FOUND);
        }

        return { message: "Framework control updated" };
    }

    static async updateFrameworkControl(id, data) {
        try {
            if (!id) {
                throw new Error("Invalid request, ID required");
            }

            if (!data) {
                throw new Error("Invalid request, update body required");
            }

            return await sequelize.transaction(async (t) => {
                const frameworkControl = await FrameWorkControl.findByPk(id, { transaction: t });

                if (!frameworkControl) {
                    console.log("No control found:", id);
                    throw new CustomError(Messages.FRAMEWORK_CONTROLS.NOT_FOUND, HttpStatus.NOT_FOUND);
                }

                this.validateFrameworkControls(data);

                const frameworkControlData = this.handleFrameworkDataColumnMapping(data);
                console.log("updating framework control with data:", frameworkControlData);

                const updateControl = await frameworkControl.update(frameworkControlData, { transaction: t });

                await MitreFrameworkControlMappings.destroy({ where: { framework_control_id: id }, transaction: t });

                await this.handleFrameworkControlToMitreControlsMapping(id, data.mitreControls, t);

                return updateControl;
            });
        } catch (err) {
            console.error("[updateFrameworkControl] Error:", err);
            throw err;
        }
    }

    static async deleteFrameWorkControl(id) {
        if (!id) {
            throw new Error("Invalid request id required");
        }
        const whereClause = { id };
        const deletedCount = await FrameWorkControl.destroy({ where: whereClause });

        if (deletedCount < 1) {
            console.log("[deleteMitreControl] No mitre threat control recorod found:");
            throw new CustomError(Messages.MITRE_THREAT_CONTROL.NOT_FOUND, HttpStatus.NOT_FOUND);
        }

        return { message: "Framework control deleted" };
    }


    static async downloadFrameworkControlsTemplateFile(res) {
        res.setHeader("Content-Type", "text/csv");
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=framework_control_import_template.csv"
        );

        const csvStream = format({ headers: true });
        csvStream.pipe(res);

        // Row 1: Clarifications / Instructions
        csvStream.write({
            "Framework Name": "Framework Name",
            "Framework Control Category Id": "Framework Control Category Id",
            "Framework Control Category": "Framework Control Category Name",
            "Framework Control SubCategory Id": "Framework Control Sub-Category Id",
            "Framework Control SubCategory": "Framework Control Sub-Category Name",
            "MITRE Control Id": "Related MITRE Control Ids separated by comma"
        });

        csvStream.end();
    }




    static async importFrameworkControlsFromCSV(filePath) {
        return new Promise((resolve, reject) => {
            const rows = [];

            fs.createReadStream(filePath)
                .pipe(parse({ headers: true }))
                .on("error", (error) => reject(error))
                .on("data", (row) => {
                    // build the framework control row
                    rows.push({
                        frameWorkName: row["Framework Name"],
                        frameWorkControlCategoryId: row["Framework Control Category Id"],
                        frameWorkControlCategory: row["Framework Control Category"],
                        frameWorkControlSubCategoryId: row["Framework Control SubCategory Id"],
                        frameWorkControlSubCategory: row["Framework Control SubCategory"],
                        mitreControls: row["MITRE Control Id"]
                            ? row["MITRE Control Id"]
                                .split(",") // CSV cell might have "M1042,M1053"
                                .map((v) => v.trim())
                                .filter((v) => v.length > 0)
                            : [],
                        status: "published",
                    });
                })
                .on("end", async () => {
                    const transaction = await sequelize.transaction();
                    try {
                        for (const data of rows) {
                            // Step 1: Create framework control
                            const frameworkControlData = {
                                frameWorkName: data.frameWorkName,
                                frameWorkControlCategoryId: data.frameWorkControlCategoryId,
                                frameWorkControlCategory: data.frameWorkControlCategory,
                                frameWorkControlSubCategoryId: data.frameWorkControlSubCategoryId,
                                frameWorkControlSubCategory: data.frameWorkControlSubCategory,
                                status: data.status,
                            };

                            const newControl = await FrameWorkControl.create(frameworkControlData, { transaction });

                            // Step 2: Map to mitre controls if provided
                            if (data.mitreControls?.length > 0) {
                                await this.handleFrameworkControlToMitreControlsMapping(
                                    newControl.id,
                                    data.mitreControls,
                                    transaction
                                );
                            }
                        }

                        await transaction.commit();
                        fs.unlinkSync(filePath);
                        resolve(rows.length);
                    } catch (err) {
                        await transaction.rollback();
                        reject(err);
                    }
                });
        });
    }


    static async exportFrameworkControlCSV(res) {
        try {
            // fetch transformed framework controls
            const controls = await this.getAllFrameworkControls();

            res.setHeader(
                "Content-disposition",
                "attachment; filename=framework_controls_export.csv"
            );
            res.setHeader("Content-Type", "text/csv");

            const csvStream = format({
                headers: true,
                transform: (row) => ({
                    "Framework Name": row.frameWorkName,
                    "Control Category Id": row.frameWorkControlCategoryId ?? "",
                    "Control Category": row.frameWorkControlCategoryId ?? "",
                    "Control Sub Category Id": row.frameWorkControlSubCategoryId ?? "",
                    "Control Sub Category": row.frameWorkControlSubCategory ?? "",
                    "MITRE Controls": Array.isArray(row.mitre_controls) ? row.mitre_controls.join(", ") : "",
                    "Status": row.status,
                }),
            });

            // stream the rows into CSV
            controls.forEach((row) => csvStream.write(row));
            csvStream.end();

            csvStream.pipe(res);
        } catch (err) {
            console.error("Error exporting framework controls CSV:", err);
            throw new Error(err);
        }
    }

    static handleControlsFilters(
        searchPattern = null,
        statusFilter = [],
        attrFilters = []
    ) {
        let conditions = [];

        if (searchPattern) {
            conditions.push({
                [Op.or]: [
                    { mitreControlId: { [Op.iLike]: `%${searchPattern}%` } },
                    { mitreControlName: { [Op.iLike]: `%${searchPattern}%` } },
                    { mitreControlType: { [Op.iLike]: `%${searchPattern}%` } },
                    { mitreControlDescription: { [Op.iLike]: `%${searchPattern}%` } },
                    { bluOceanControlDescription: { [Op.iLike]: `%${searchPattern}%` } },
                ],
            });
        }
        return conditions.length > 0 ? { [Op.and]: conditions } : {};
    }

    static handleFrameworkControlsFilters(
        frameworkName = null,
        searchPattern = null,
        statusFilter = [],
        attrFilters = []
    ) {
        let conditions = [];
        if (searchPattern) {
            conditions.push({
                [Op.or]: [
                    { frameWorkControlCategoryId: { [Op.iLike]: `%${searchPattern}%` } },
                    { frameWorkControlCategory: { [Op.iLike]: `%${searchPattern}%` } },
                    { frameWorkControlDescription: { [Op.iLike]: `%${searchPattern}%` } },
                    { frameWorkControlSubCategoryId: { [Op.iLike]: `%${searchPattern}%` } },
                    { frameWorkControlSubCategory: { [Op.iLike]: `%${searchPattern}%` } },
                ],
            });
        }

        if (frameworkName) {
            conditions.push({
                frameWorkName: frameworkName, // must match your model's attribute name
            });
        }
        return conditions.length > 0 ? { [Op.and]: conditions } : {};
    }

    static validateMitreControlData(data) {
        const {
            subControls,
        } = data;

        if (!Array.isArray(subControls) || subControls.length < 1) {
            throw new Error("Invalid subcontrols mapping required to threat technique");
        }

    }

    static async handleMitreControlsTechniqueMapping(mitreControlId, mitreControlName, subControls, transaction) {
        if (!mitreControlId || !mitreControlId || !subControls) {
            throw new Error("Invalid request, required parameters not present");
        }
        for (const controls of subControls) {
            const mitreTechniqueId = controls.mitreTechniqueId;
            const subTechniqueId = controls.subTechniqueId;
            const mitreControlDescription = controls.mitreControlDescription;
            const bluOceanControlDescription = controls.bluOceanControlDescription;

            const payload = {
                mitreControlDescription,
                bluOceanControlDescription
            }
            const whereClause = {
                mitreTechniqueId,
                subTechniqueId,
                mitreControlId,
                mitreControlName
            }


            const [affectedCount] = await MitreThreatControl.update(payload,{ where: whereClause, transaction: transaction});
            
            if (affectedCount < 1) {
                throw new Error("Failed to update, no record found")
            }

        }
    }

    static validateFrameworkControls(data) {
        const {
            frameWorkName,
            frameWorkControlCategoryId,
            frameWorkControlCategory,
            frameWorkControlSubCategoryId,
            frameWorkControlSubCategory,
        } = data;

        if (!frameWorkName) {
            console.log("a")
            throw new CustomError(Messages.FRAMEWORK_CONTROLS.INVALID_FRAMEWORK_NAME_REQUIRED);
        }

        if (!frameWorkControlCategoryId || !frameWorkControlCategory) {
            throw new CustomError(Messages.FRAMEWORK_CONTROLS.INVALID_FRAMEWORK_INPUTS, HttpStatusCodes.BAD_REQUEST);

        }

    }

    static handleFrameworkDataColumnMapping(data) {
        const fields = [
            "frameWorkName",
            "frameWorkControlCategoryId",
            "frameWorkControlCategory",
            "frameWorkControlSubCategoryId",
            "frameWorkControlSubCategory",
            "status",
        ];

        return Object.fromEntries(
            fields.map((key) => [key, data[key] === "" ? null : data[key]])
        );
    }

    static async handleFrameworkControlToMitreControlsMapping(
        frameWorkControlId,
        relatedMitreControls,
        transaction
    ) {

        if (!frameWorkControlId) {
            throw new Error("aa")
        }
        if (Array.isArray(relatedMitreControls)) {
            const payload = [];
            for (const mitreControl of relatedMitreControls) {

                const controlData = await MitreThreatControl.findAll({
                    where: { mitreControlId: mitreControl }
                });

                if (controlData.length === 0) {
                    console.log("[Framework Control] Related mitre controls not found:", mitreControl);
                    throw new CustomError(
                        Messages.FRAMEWORK_CONTROLS.INVALID_FRAMEWORK_MITRE_MAPPING,
                        HttpStatus.NOT_FOUND
                    );
                }

                for (const control of controlData) {
                    payload.push({
                        mitre_control_id: control.id,
                        framework_control_id: frameWorkControlId,
                    });
                }

            }
            await MitreFrameworkControlMappings.bulkCreate(payload, { transaction });
        }
    }
}

module.exports = ControlsService;