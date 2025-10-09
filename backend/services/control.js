const { format } = require("fast-csv");
const HttpStatusCodes = require("../constants/httpStatusCodes");
const Messages = require("../constants/messages");
const {
  sequelize,
  MitreThreatControl,
  FrameWorkControl,
  MitreFrameworkControlMappings,
} = require("../models");
const CustomError = require("../utils/CustomError");
const fs = require("fs");
const { parse } = require("fast-csv");
const {
  MITRE_CONTROLS,
  GENERAL,
  FRAMEWORK_CONTROLS,
} = require("../constants/library");
const { Op, where } = require("sequelize");

class ControlsService {
  static async getAllControl(
    page = 0,
    limit = 6,
    searchPattern = null,
    sortBy = "created_at",
    sortOrder = "ASC",
    fields = null,
    statusFilter = [],
    attrFilters = []
  ) {
    if (!MITRE_CONTROLS.ALLOWED_SORT_FILED.includes(sortBy)) {
      sortBy = "created_at";
    }

    if (!GENERAL.ALLOWED_SORT_ORDER.includes(sortOrder)) {
      sortOrder = "ASC";
    }
    console.log(statusFilter, attrFilters);
    const whereClause = this.handleControlsFilters(
      searchPattern,
      statusFilter,
      attrFilters
    );

    const includeRelation = {
      model: FrameWorkControl,
      as: "framework_controls",
    };

    const data = await MitreThreatControl.findAll({
      order: [[sortBy, sortOrder]],
      where: whereClause,
      include: includeRelation,
    });

    if (fields) {
      const uniqueValues = {};
      const fieldList = Array.isArray(fields) ? fields : [fields];

      fieldList.forEach((field) => {
        uniqueValues[field] = [
          ...new Set(data.map((row) => row[field]).filter((v) => v !== null)),
        ];
      });

      return uniqueValues;
    }

    const grouped = Object.values(
      data.reduce((acc, row) => {
        const key = row.mitreControlId;

        if (!acc[key]) {
          acc[key] = {
            mitreControlId: row.mitreControlId,
            controlPriority: row.controlPriority,
            mitreControlType: row.mitreControlType,
            controlDetails: [],
            status: row.status,
            created_at: row.created_at,
            updated_at: row.updated_at,
          };
        }

        // Look for existing controlDetail with same name + type
        let controlDetail = acc[key].controlDetails.find(
          (cd) => cd.mitreControlName === row.mitreControlName
        );

        if (!controlDetail) {
          controlDetail = {
            mitreControlName: row.mitreControlName,
            subControls: [],
          };
          acc[key].controlDetails.push(controlDetail);
        }

        // Push into subControls
        controlDetail.subControls.push({
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

  static async deleteMitreControl(mitreControlId, mitreControlNames = []) {
    const whereClause = { mitreControlId };

    if (mitreControlNames.length < 1) {
      throw new CustomError(
        "mitreControl Names array required",
        HttpStatusCodes.BAD_REQUEST
      );
    }
    whereClause.mitreControlName = {
      [Op.in]: mitreControlNames,
    };

    const deletedCount = await MitreThreatControl.destroy({
      where: whereClause,
    });

    if (deletedCount === 0) {
      console.log(
        "[deleteMitreControl] No mitre threat control recorod found:",
        mitreControlId,
        mitreControlNames
      );
      throw new CustomError(
        Messages.MITRE_THREAT_CONTROL.NOT_FOUND,
        HttpStatusCodes.NOT_FOUND
      );
    }

    console.log(
      "[updateMitreControlStatus] Status updated successfully:",
      mitreControlId,
      mitreControlNames
    );
    return { message: Messages.MITRE_CONTROLS.DELETED_SUCCESSFULLY };
  }

  static async updateMitreControls(updateBody) {
    const {
      mitreControlId,
      mitreControlType,
      controlPriority,
      controlDetails,
      status,
    } = updateBody;

    // array of subControls
    const incomingSubControls = controlDetails.flatMap((control) => {
      return control.subControls.map((sub) => ({
        ...sub,
        mitreControlId,
        mitreControlType,
        controlPriority,
        mitreControlName: control.mitreControlName,
        status: status || "published",
      }));
    });

    const incomingIds = incomingSubControls.map((sub) => sub.id);

    // Run everything inside a transaction
    return sequelize.transaction(async (t) => {
      // 1. Delete DB subControls that are not in request
      await MitreThreatControl.destroy({
        where: {
          mitreControlId,
          id: { [Op.notIn]: incomingIds }, // delete missing subControls
        },
        transaction: t,
      });

      // 2. Upsert incoming subControls
      for (const sub of incomingSubControls) {
        await MitreThreatControl.update(
          {
            mitreTechniqueId: sub.mitreTechniqueId,
            mitreTechniqueName: sub.mitreTechniqueName,
            subTechniqueId: sub.subTechniqueId || null,
            subTechniqueName: sub.subTechniqueName || null,
            mitreControlId: sub.mitreControlId,
            mitreControlName: sub.mitreControlName,
            mitreControlType: sub.mitreControlType,
            mitreControlDescription: sub.mitreControlDescription,
            bluOceanControlDescription: sub.bluOceanControlDescription,
            controlPriority: sub.controlPriority,
            status: sub.status,
          },
          {
            where: { id: sub.id },
            transaction: t,
          }
        );
      }

      return { message: "Sync complete" };
    });
  }

  static async updateMitreControlStatus(mitreControlId, status) {
    const whereClause = { mitreControlId };

    if (!status) {
      throw new Error("Status required");
    }

    const [updatedRowsCount] = await MitreThreatControl.update(
      { status },
      { where: whereClause }
    );

    if (updatedRowsCount === 0) {
      console.log(
        "[updateMitreControlStatus] No mitre threat control recorod found:",
        mitreControlId
      );
      throw new CustomError(
        Messages.MITRE_THREAT_CONTROL.NOT_FOUND,
        HttpStatusCodes.NOT_FOUND
      );
    }

    console.log(
      "[updateMitreControlStatus] Status updated successfully:",
      mitreControlId
    );
    return { message: Messages.MITRE_CONTROLS.UPDATED_STATUS };
  }

  static async createFrameworkControl(data) {
    try {
      return await sequelize.transaction(async (t) => {
        console.log("[createFrameworkControl] create FrameworkControl", data);

        this.validateFrameworkControls(data);

        const frameworkControlData =
          this.handleFrameworkDataColumnMapping(data);
        console.log(
          "Creating framework control with data:",
          frameworkControlData
        );

        const newControl = await FrameWorkControl.create(frameworkControlData, {
          transaction: t,
        });

        await this.handleFrameworkControlToMitreControlsMapping(
          newControl.id,
          data.mitreControls,
          t
        );

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
    sortOrder = "ASC"
  ) {
    if (!FRAMEWORK_CONTROLS.ALLOWED_SORT_FILED.includes(sortBy)) {
      sortBy = "created_at";
    }

    if (!GENERAL.ALLOWED_SORT_ORDER.includes(sortOrder)) {
      sortOrder = "ASC";
    }

    const whereClause = this.handleFrameworkControlsFilters(
      frameWorkName,
      searchPattern
    );

    const data = await FrameWorkControl.findAll({
      where: whereClause,
      order: [[sortBy, sortOrder]],
      include: [
        {
          model: sequelize.models.MitreThreatControl,
          as: "mitre_controls", // must match the alias in your association
          through: { attributes: [] }, // exclude join table fields
        },
      ],
    });
    const controls = data.map((s) => s.toJSON());

    for (let i = 0; i < controls.length; i++) {
      const control = controls[i];
      const mitreControls = control.mitre_controls ?? [];

      const uniqueMitreControlIds = [
        ...new Set(mitreControls?.map((item) => item.mitreControlId)),
      ];

      control.mitreControls = uniqueMitreControlIds;
      delete control.mitre_controls;
    }

    // pagination required
    if (limit != 0) {
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
    } else {
      const total = controls.length;
      const totalPages = 1;
      return {
        data: controls,
        total,
        totalPages,
      };
    }
  }

  static async updateFrameWorkControlStatus(status, id) {
    if (!status) {
      throw new Error("Status required");
    }

    if (!id) {
      throw new Error("Invalid request id required");
    }

    const whereClause = { id };

    const [updatedCount] = await FrameWorkControl.update(
      { status },
      { where: whereClause }
    );

    if (updatedCount < 1) {
      console.log(
        "[deleteMitreControl] No mitre threat control recorod found:"
      );
      throw new CustomError(
        Messages.MITRE_THREAT_CONTROL.NOT_FOUND,
        HttpStatusCodes.NOT_FOUND
      );
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
        const frameworkControl = await FrameWorkControl.findByPk(id, {
          transaction: t,
        });

        if (!frameworkControl) {
          console.log("No control found:", id);
          throw new CustomError(
            Messages.FRAMEWORK_CONTROLS.NOT_FOUND,
            HttpStatusCodes.NOT_FOUND
          );
        }

        this.validateFrameworkControls(data);

        const frameworkControlData =
          this.handleFrameworkDataColumnMapping(data);
        console.log(
          "updating framework control with data:",
          frameworkControlData
        );

        const updateControl = await frameworkControl.update(
          frameworkControlData,
          { transaction: t }
        );

        await MitreFrameworkControlMappings.destroy({
          where: { framework_control_id: id },
          transaction: t,
        });

        await this.handleFrameworkControlToMitreControlsMapping(
          id,
          data.mitreControls,
          t
        );

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
      console.log(
        "[deleteMitreControl] No mitre threat control recorod found:"
      );
      throw new CustomError(
        Messages.MITRE_THREAT_CONTROL.NOT_FOUND,
        HttpStatusCodes.NOT_FOUND
      );
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
      "MITRE Control Id": "Related MITRE Control Ids separated by comma",
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
            frameWorkControlSubCategoryId:
              row["Framework Control SubCategory Id"],
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
                frameWorkControlSubCategoryId:
                  data.frameWorkControlSubCategoryId,
                frameWorkControlSubCategory: data.frameWorkControlSubCategory,
                status: data.status,
              };

              const newControl = await FrameWorkControl.create(
                frameworkControlData,
                { transaction }
              );

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

  static async exportFrameworkControlCSV(frameworkName, res) {
    try {
      // fetch transformed framework controls
      const controls = await this.getAllFrameworkControls(frameworkName, 1, 0);

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
          "MITRE Controls": Array.isArray(row.mitreControls)
            ? row.mitre_controls.join(", ")
            : "",
          Status: row.status,
        }),
      });

      // stream the rows into CSV
      controls?.data?.forEach((row) => csvStream.write(row));
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
    // 2Status filter
    if (statusFilter.length > 0) {
      conditions.push({ status: { [Op.in]: statusFilter } });
    }

    // Attribute filters
    if (attrFilters.length > 0) {
      const threatColumns = Object.keys(MitreThreatControl.rawAttributes);
      const threatWhere = [];

      // Separate filters: direct columns vs mapping table
      attrFilters.forEach((f) => {
        if (threatColumns.includes(f.filterName)) {
          // Direct column filter
          const columnType =
            MitreThreatControl.rawAttributes[f.filterName].type.key;
          if (columnType === "ARRAY") {
            threatWhere.push({ [f.filterName]: { [Op.overlap]: f.values } });
          } else {
            threatWhere.push({ [f.filterName]: { [Op.in]: f.values } });
          }
        }
      });

      // Add direct column filters
      if (threatWhere.length > 0) {
        conditions.push({ [Op.and]: threatWhere });
      }
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
          {
            frameWorkControlSubCategoryId: { [Op.iLike]: `%${searchPattern}%` },
          },
          { frameWorkControlSubCategory: { [Op.iLike]: `%${searchPattern}%` } },
        ],
      });
    }

    if (frameworkName) {
      conditions.push({
        frameWorkName: frameworkName,
      });
    }
    return conditions.length > 0 ? { [Op.and]: conditions } : {};
  }

  static validateMitreControlData(data) {
    const { subControls } = data;

    if (!Array.isArray(subControls) || subControls.length < 1) {
      throw new Error(
        "Invalid subcontrols mapping required to threat technique"
      );
    }
  }

  static async handleMitreControlsTechniqueMapping(
    mitreControlId,
    mitreControlName,
    subControls,
    transaction
  ) {
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
        bluOceanControlDescription,
      };
      const whereClause = {
        mitreTechniqueId,
        subTechniqueId,
        mitreControlId,
        mitreControlName,
      };

      const [affectedCount] = await MitreThreatControl.update(payload, {
        where: whereClause,
        transaction: transaction,
      });

      if (affectedCount < 1) {
        throw new Error("Failed to update, no record found");
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
      console.log("a");
      throw new CustomError(
        Messages.FRAMEWORK_CONTROLS.INVALID_FRAMEWORK_NAME_REQUIRED
      );
    }

    if (!frameWorkControlCategoryId || !frameWorkControlCategory) {
      throw new CustomError(
        Messages.FRAMEWORK_CONTROLS.INVALID_FRAMEWORK_INPUTS,
        HttpStatusCodes.BAD_REQUEST
      );
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
      throw new Error("aa");
    }
    if (Array.isArray(relatedMitreControls)) {
      const payload = [];
      for (const mitreControl of relatedMitreControls) {
        const controlData = await MitreThreatControl.findAll({
          where: { mitreControlId: mitreControl },
        });

        if (controlData.length === 0) {
          console.log(
            "[Framework Control] Related mitre controls not found:",
            mitreControl
          );
          throw new CustomError(
            Messages.FRAMEWORK_CONTROLS.INVALID_FRAMEWORK_MITRE_MAPPING,
            HttpStatusCodes.NOT_FOUND
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
