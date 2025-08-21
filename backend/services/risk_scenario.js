const {
    RiskScenario,
    RiskScenarioAttribute,
    MetaData,
    sequelize,
    Process,
    ProcessRiskScenarioMappings,
    Sequelize,
} = require("../models");
const { Op } = require("sequelize");
const CustomError = require("../utils/CustomError");
const HttpStatus = require("../constants/httpStatusCodes");
const Messages = require("../constants/messages");
const { RISK_SCENARIO, GENERAL } = require("../constants/library");
const { format } = require("@fast-csv/format");
const QueryStream = require("pg-query-stream");


class RiskScenarioService {
  static async createRiskScenario(data) {
    return await sequelize.transaction(async (t) => {
      console.log("[create risk scenario] request received", data);

      this.validateRiskScenarioData(data);

      const riskScenarioData = this.handleRiskScenarioColumnMapping(data);

      console.log(
        "[createRiskScenario], risk scenario mapped values",
        riskScenarioData
      );

      const scenario = await RiskScenario.create(riskScenarioData, {
        transaction: t,
      });

      await this.handleRiskScenarioProcessMapping(
        scenario.id,
        data.related_processes ?? [],
        t
      );

      await this.handleRiskScenarioAttributes(
        scenario.id,
        data.attributes ?? [],
        t
      );

      return scenario;
    });
  }

  static async getAllRiskScenarios(
    page = 0,
    limit = 6,
    searchPattern = null,
    sortBy = "created_at",
    sortOrder = "ASC",
    statusFilter = [],
    attrFilters = []
  ) {
    const offset = page * limit;

    if (!RISK_SCENARIO.RISK_SCENARIO_SORT_FIELDS.includes(sortBy)) {
      sortBy = "created_at";
    }

    if (!GENERAL.ALLOWED_SORT_ORDER.includes(sortOrder)) {
      sortOrder = "ASC";
    }

    const whereClause = this.handleRiskScenarioFilters(
      searchPattern,
      statusFilter,
      attrFilters
    );

    const total = await RiskScenario.count({
      where: whereClause,
    });

    const data = await RiskScenario.findAll({
      limit,
      offset,
      order: [[sortBy, sortOrder]],
      where: whereClause,
      include: [
        {
          model: RiskScenarioAttribute,
          as: "attributes",
          include: [{ model: MetaData, as: "metaData" }],
        },
        { model: Process, as: "processes" },
      ],
    });

    const scenarios = data.map((s) => {
      const scenario = s.toJSON();
      scenario.industry = scenario.attributes
        ?.filter((a) => a.metaData?.name?.toLowerCase() === "industry")
        ?.flatMap((a) => a.values);
      scenario.domain = scenario.attributes
        ?.filter((a) => a.metaData?.name?.toLowerCase() === "domain")
        ?.flatMap((a) => a.values);
      scenario.attributes = scenario.attributes.map((a) => ({
        meta_data_key_id: a.meta_data_key_id,
        values: a.values,
      }));
      scenario.related_processes = scenario.processes.map((p) => p.id);
      delete scenario.processes;
      return scenario;
    });

    return {
      data: scenarios,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  static async getRiskScenarioById(id) {
    const scenario = await RiskScenario.findByPk(id, {
      include: [
        {
          model: RiskScenarioAttribute,
          as: "attributes",
          include: [{ model: MetaData, as: "metaData" }],
        },
      ],
    });

    if (!scenario) {
      throw new CustomError(
        Messages.RISK_SCENARIO.NOT_FOUND(id),
        HttpStatus.NOT_FOUND
      );
    }

    return scenario;
  }

  static async updateRiskScenario(id, data) {
    return await sequelize.transaction(async (t) => {
      const scenario = await RiskScenario.findByPk(id, { transaction: t });

      if (!scenario) {
        throw new CustomError(
          Messages.RISK_SCENARIO.NOT_FOUND(id),
          HttpStatus.NOT_FOUND
        );
      }

      this.validateRiskScenarioData(data);

      const riskScenarioData = this.handleRiskScenarioColumnMapping(data);

      const updatedRiskScenario = await scenario.update(riskScenarioData, {
        transaction: t,
      });

      await ProcessRiskScenarioMappings.destroy({
        where: { risk_scenario_id: id },
        transaction: t,
      });

      await RiskScenarioAttribute.destroy({
        where: { risk_scenario_id: id },
        transaction: t,
      });

      await this.handleRiskScenarioProcessMapping(
        scenario.id,
        data.related_processes ?? [],
        t
      );

      await this.handleRiskScenarioAttributes(
        scenario.id,
        data.attributes ?? [],
        t
      );

      return updatedRiskScenario;
    });
  }

  static async deleteRiskScenarioById(id) {
    const riskScenario = await RiskScenario.findByPk(id);

    if (!riskScenario) {
      console.log("[deleteRiskScenario] Not found:", id);
      throw new CustomError(
        Messages.RISK_SCENARIO.NOT_FOUND(id),
        HttpStatus.NOT_FOUND
      );
    }

    await riskScenario.destroy();
    return { message: Messages.RISK_SCENARIO.DELETED };
  }

  static async updateRiskScenarioStatus(id, status) {
    const allowed_status_values = ["published", "not_published", "draft"];

    if (!allowed_status_values.includes(status)) {
      console.log("[updateRiskScenarioStatus] Invalid status:", id, status);
      throw new CustomError(
        Messages.RISK_SCENARIO.INVALID_STATUS,
        HttpStatus.BAD_REQUEST
      );
    }

    const [updatedRowsCount] = await RiskScenario.update(
      { status },
      { where: { id } }
    );

    if (updatedRowsCount === 0) {
      console.log("[updateRiskScenarioStatus] Not found:", id);
      throw new CustomError(
        Messages.RISK_SCENARIO.NOT_FOUND(id),
        HttpStatus.NOT_FOUND
      );
    }

    console.log("[updateRiskScenarioStatus] Updated:", id, status);
    return { message: Messages.RISK_SCENARIO.STATUS_UPDATED };
  }

  static async importRiskScenariosFromCSV(filePath) {
    return new Promise((resolve, reject) => {
      const rows = [];

      fs.createReadStream(filePath)
        .pipe(parse({ headers: true }))
        .on("error", (error) => reject(error))
        .on("data", (row) => {
          rows.push({
            risk_scenario: row["Risk Scenario"],
            risk_description: row["Risk Description"],
            risk_statement: row["Risk Statement"],
            status: "published",
          });
        })
        .on("end", async () => {
          try {
            await RiskScenario.bulkCreate(rows, { ignoreDuplicates: true });
            fs.unlinkSync(filePath);
            resolve(rows.length);
          } catch (err) {
            reject(err);
          }
        });
    });
  }

  static async exportRiskScenariosCSV(res) {
    const connection = await sequelize.connectionManager.getConnection();

    try {
      const sql = `
            SELECT *
            FROM library_risk_scenarios
            ORDER BY created_at DESC
            `;

      const query = new QueryStream(sql);
      const stream = connection.query(query);

      res.setHeader(
        "Content-disposition",
        "attachment; filename=risk_scenarios.csv"
      );
      res.setHeader("Content-Type", "text/csv");

      const csvStream = format({
        headers: true,
        transform: (row) => ({
          "Risk Scenario ID": row.risk_code,
          "Risk Scenario": row.risk_scenario,
          "Risk Description": row.risk_description,
          "Risk Statement": row.risk_statement,
          Status: row.status,
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

  static validateRiskScenarioData(data) {
    const { risk_scenario, status } = data;

    if (!risk_scenario) {
      console.log("[createRiskScenario] Missing risk_scenario");
      throw new CustomError(
        Messages.RISK_SCENARIO.REQUIRED,
        HttpStatus.BAD_REQUEST
      );
    }

    if (!status || ( status && !GENERAL.STATUS_SUPPORTED_VALUES.includes(status))) {
      console.log("[createRiskScenario] Invalid status:", status);
      throw new CustomError(
        Messages.RISK_SCENARIO.INVALID_STATUS,
        HttpStatus.BAD_REQUEST
      );
    }
  }

  static handleRiskScenarioColumnMapping(data) {
    const fields = [
      "risk_scenario",
      "risk_description",
      "risk_statement",
      "status",
      "risk_field_1",
      "risk_field_2",
    ];

      return Object.fromEntries(
          fields.map((key) => [key, data[key] === "" ? null : data[key]])
      );
  }

  static async handleRiskScenarioProcessMapping(
    riskScenarioId,
    relatedProcesses,
    transaction
  ) {
    if (Array.isArray(relatedProcesses)) {
      for (const process of relatedProcesses) {
        if (typeof process !== "number" || process < 0) {
          console.log("[RiskScenario] Invalid related process:", process);
          throw new CustomError(
            Messages.RISK_SCENARIO.INVALID_PROCESS_MAPPING,
            HttpStatus.BAD_REQUEST
          );
        }

        const processData = await Process.findByPk(process);
        if (!processData) {
          console.log("[RiskScenario] Related process not found:", process);
          throw new CustomError(
            Messages.RISK_SCENARIO.INVALID_PROCESS_MAPPING,
            HttpStatus.NOT_FOUND
          );
        }

        await ProcessRiskScenarioMappings.create(
          {
            risk_scenario_id: riskScenarioId,
            process_id: process,
          },
          { transaction }
        );
      }
    }
  }

  static async handleRiskScenarioAttributes(
    riskScenarioId,
    attributes,
    transaction
  ) {
    for (const attr of attributes) {
      if (!attr.meta_data_key_id || !attr.values) {
        console.log("Missing meta_data_key_id or values:", attr);
        throw new CustomError(
          Messages.LIBARY.MISSING_ATTRIBUTE_FIELD,
          HttpStatus.BAD_REQUEST
        );
      }

      const metaData = await MetaData.findByPk(attr.meta_data_key_id, {
        transaction,
      });
      if (!metaData) {
        console.log("MetaData not found:", attr.meta_data_key_id);
        throw new CustomError(
          Messages.LIBARY.METADATA_NOT_FOUND,
          HttpStatus.NOT_FOUND
        );
      }

      const supportedValues = metaData.supported_values;

      if (
        supportedValues?.length > 0 &&
        !attr.values.every((v) => supportedValues.includes(v))
      ) {
        console.log("Unsupported values in attribute:", attr);
        console.log("aaabb");
        throw new CustomError(
          Messages.LIBARY.INVALID_ATTRIBUTE_VALUE,
          HttpStatus.BAD_REQUEST
        );
      }

      await RiskScenarioAttribute.create(
        {
          risk_scenario_id: riskScenarioId,
          meta_data_key_id: attr.meta_data_key_id,
          values: attr.values,
        },
        { transaction }
      );
    }
  }

  static handleRiskScenarioFilters(
    searchPattern = null,
    statusFilter = [],
    attrFilters = []
  ) {
    let conditions = [];

    if (searchPattern) {
      conditions.push({
        [Op.or]: [
          { risk_scenario: { [Op.iLike]: `%${searchPattern}%` } },
          { risk_description: { [Op.iLike]: `%${searchPattern}%` } },
          { risk_statement: { [Op.iLike]: `%${searchPattern}%` } },
        ],
      });
    }

    if (statusFilter.length > 0) {
      conditions.push({ status: { [Op.in]: statusFilter } });
    }

    if (attrFilters.length > 0) {
      let subquery = "";

      attrFilters.forEach((filter, idx) => {
        const metaDataKeyId = parseInt(filter.metaDataKeyId, 10);
        if (isNaN(metaDataKeyId)) {
          throw new Error("Invalid metaDataKeyId");
        }

        const valuesArray = filter.values
          .map((v) => sequelize.escape(v))
          .join(",");

        if (idx > 0) subquery += " INTERSECT ";
        subquery += `
                SELECT "risk_scenario_id"
                FROM library_attributes_risk_scenario_mapping
                WHERE "meta_data_key_id" = ${metaDataKeyId}
                AND "values" && ARRAY[${valuesArray}]::varchar[]
            `;
      });

      conditions.push({ id: { [Op.in]: Sequelize.literal(`(${subquery})`) } });
    }
    return conditions.length > 0 ? { [Op.and]: conditions } : {};
  }
}

module.exports = RiskScenarioService;