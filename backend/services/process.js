const { Op } = require("sequelize");
const {
  Process,
  sequelize,
  ProcessRelationship,
  MetaData,
  ProcessAttribute,
  RiskScenario,
  Sequelize,
} = require("../models");
const { format } = require("@fast-csv/format");
const QueryStream = require("pg-query-stream");
const fs = require("fs");
const { parse } = require("fast-csv");

const { GENERAL, PROCESS } = require("../constants/library");

const CustomError = require("../utils/CustomError");
const Messages = require("../constants/messages");
const HttpStatus = require("../constants/httpStatusCodes");
// const { search } = require("../routes/process");

class ProcessService {
  static async createProcess(data) {
    return await sequelize.transaction(async (t) => {
      this.validateProcessData(data);

      const processData = this.handleProcessDataColumnMapping(data);
      console.log("Creating process with data:", processData);

      const newProcess = await Process.create(processData, { transaction: t });

      console.log("aaasaa");
      if (
        Array.isArray(data.process_dependency) &&
        data.process_dependency.length > 0
      ) {
        await this.handleProcessDependencies(
          "create",
          newProcess.id,
          data.process_dependency,
          t
        );
      }

      if (Array.isArray(data.attributes) && data.attributes.length > 0) {
        console.log(data.attributes);
        await this.handleProcessAttributes(newProcess.id, data.attributes, t);
      }

      return newProcess;
    });
  }

  static async getAllProcesses(
    page = 0,
    limit = 6,
    searchPattern = null,
    sortBy = "created_at",
    sortOrder = "ASC",
    statusFilter = [],
    attrFilters = []
  ) {
    console.log("Fetching all processes");

    const offset = page * limit;

    if (!PROCESS.PROCESS_ALLOWED_SORT_FIELDS.includes(sortBy)) {
      sortBy = "created_at";
    }

    if (!GENERAL.ALLOWED_SORT_ORDER.includes(sortOrder)) {
      sortOrder = "DESC";
    }

    const whereClause = await this.handleProcessFilters(
      searchPattern,
      statusFilter,
      attrFilters
    );

    const includeRelations = [
      {
        model: ProcessAttribute,
        as: "attributes",
        include: [{ model: MetaData, as: "metaData" }],
      },
      {
        model: RiskScenario,
        as: "riskScenarios",
      },
      {
        model: ProcessRelationship,
        as: "sourceRelationships",
      },
      {
        model: ProcessRelationship,
        as: "targetRelationships",
      },
    ];

    const total = await Process.count({
      where: whereClause,
    });

    const data = await Process.findAll({
      ...(limit > 0 ? { limit, offset } : {}),
      where: whereClause,
      order: [[sortBy, sortOrder]],
      include: includeRelations,
    });

    let processes = data.map((s) => s.toJSON());

    for (let i = 0; i < processes.length; i++) {
      const p = processes[i];

      p.industry = p.attributes
        ?.filter((val) => val.metaData?.name?.toLowerCase() === "industry")
        ?.flatMap((val) => val.values);
      p.domain = p.attributes
        ?.filter((val) => val.metaData?.name?.toLowerCase() === "domain")
        ?.flatMap((val) => val.values);

      p.attributes = p.attributes.map((val) => ({
        meta_data_key_id: val.meta_data_key_id,
        values: val.values,
      }));

      p.process_dependency = [];

      if (p?.sourceRelationships?.length > 0) {
        p.process_dependency.push(
          ...p.sourceRelationships.map((val) => ({
            source_process_id: val.source_process_id,
            target_process_id: val.target_process_id,
            relationship_type: val.relationship_type,
          }))
        );
      }

      if (p?.targetRelationships?.length > 0) {
        p.process_dependency.push(
          ...p.targetRelationships.map((val) => ({
            source_process_id: val.source_process_id,
            target_process_id: val.target_process_id,
            relationship_type: val.relationship_type,
          }))
        );
      }

      delete p.sourceRelationships;
      delete p.targetRelationships;
    }

    return {
      data: processes,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
  static async getAllProcessForListing() {
    const data = await Process.findAll({
      attributes: ["id", "process_code", "process_name"],
    });
    let processes = data.map((s) => s.toJSON());
    return {
      data: processes,
    };
  }

  static async getProcessById(id) {
    const process = await Process.findByPk(id);

    if (!process) {
      console.log("Process not found:", id);
      throw new CustomError(Messages.PROCESS.NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    return process;
  }

  static async updateProcess(id, data) {
    return await sequelize.transaction(async (t) => {
      const process = await Process.findByPk(id, { transaction: t });

      if (!process) {
        console.log("No process found:", id);
        throw new CustomError(Messages.PROCESS.NOT_FOUND, HttpStatus.NOT_FOUND);
      }

      this.validateProcessData(data);

      const processData = this.handleProcessDataColumnMapping(data);
      await process.update(processData, { transaction: t });

      await ProcessAttribute.destroy({
        where: { process_id: id },
        transaction: t,
      });
      await ProcessRelationship.destroy({
        where: {
          [Op.or]: [{ source_process_id: id }, { target_process_id: id }],
        },
        transaction: t,
      });
      if (
        Array.isArray(data.process_dependency) &&
        data.process_dependency.length > 0
      ) {
        await this.handleProcessDependencies(
          "update",
          id,
          data.process_dependency,
          t
        );
      }
      if (Array.isArray(data.attributes) && data.attributes.length > 0) {
        console.log(data.attributes);
        await this.handleProcessAttributes(id, data.attributes, t);
      }

      console.log("Process updated successfully:", id);
    });
  }

  static async updateProcessStatus(id, status) {
    if (!GENERAL.STATUS_SUPPORTED_VALUES.includes(status)) {
      console.log("[updateProcessStatus] Invalid status:", status);
      throw new CustomError(
        Messages.PROCESS.INVALID_STATUS,
        HttpStatus.BAD_REQUEST
      );
    }

    const [updatedRowsCount] = await Process.update(
      { status },
      { where: { id } }
    );

    if (updatedRowsCount === 0) {
      console.log("[updateProcessStatus] No process found:", id);
      throw new CustomError(Messages.PROCESS.NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    console.log("[updateProcessStatus] Status updated successfully:", id);
    return { message: Messages.PROCESS.STATUS_UPDATED };
  }

  static async deleteProcess(id) {
    const process = await Process.findByPk(id);

    if (!process) {
      console.log("Delete failed - process not found:", id);
      throw new CustomError(Messages.PROCESS.NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    await process.destroy();
    console.log("Process deleted successfully:", id);
    return { message: Messages.PROCESS.DELETED };
  }

  static async downloadProcessTemplateFile(res) {
    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=process_template.csv"
    );

    const csvStream = format({ headers: true });
    csvStream.pipe(res);

    // Row 1: Clarifications / Instructions
    csvStream.write({
      "Process Name": "Enter application name (text)",
      "Process Description": "Person/Dept responsible",
      "Senior Executive Name": "Senior Executive Name",
      "Senior Executive Email": "Senior Executive Email",
      "Operations Owner Name": "Operation Owner Name",
      "Operations Owner Email": "Operation Owner Email",
      "Technology Owner Name": "Technology Owner Name",
      "Technology Owner Email": "Technology Owner Email",
      "Oraganizational Revenue Impact Percentage":
        "Oraganizational Revenue Impact Percentage in number eg: 20",
      "Financial Materiality": "Yes / No",
      "Third Party Involvement": "Yes / No",
      Users: "Users Type Internal Users / External Users / Third Party Users",
      "Regulatory and Compliance": "regulations",
      "Criticality Of Data Processed": "Criticality Of Data Processed",
      "Data Processed":
        "List of values separated by Comma from " +
        GENERAL.DATA_TYPES.join(","),
      Industry: "List of industries the process tagged to separated by comma",
    });

    csvStream.end();
  }

  static async exportProcessesCSV(res) {
    const connection = await sequelize.connectionManager.getConnection();

    try {
      const sql = `
            SELECT *
            FROM library_processes
            ORDER BY created_at DESC
            `;

      const query = new QueryStream(sql);
      const stream = connection.query(query);

      res.setHeader(
        "Content-disposition",
        "attachment; filename=processes_export.csv"
      );
      res.setHeader("Content-Type", "text/csv");

      const csvStream = format({
        headers: true,
        transform: (row) => ({
          "Process ID": row.process_code,
          "Process Name": row.process_name,
          "Process Description": row.process_name,
          "Senior Executive Name": row.senior_executive__owner_name,
          "Senior Executive Email": row.senior_executive__owner_email,
          "Operations Owner Name": row.operations__owner_name,
          "Operations Owner Email": row.operations__owner_email,
          "Technology Owner Name": row.technology_owner_name,
          "Technology Owner Email": row.technology_owner_email,
          "Oraganizational Revenue Impact Percentage":
            row.organizational_revenue_impact_percentage,
          "Financial Materiality": row.financial_materiality,
          "Third Party Involvement": row.third_party_involvement,
          Users: row.users_customers,
          "Regulatory and Compliance": row.regulatory_and_compliance,
          "Criticality Of Data Processed": row.criticality_of_data_processed,
          "Data Processed": (row.data_processed ?? []).join(","),
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

  // static async importProcessesFromCSV(filePath) {
  //     function parseBoolean(value) {
  //         if (!value) return null; // catch empty string or undefined
  //         const v = value.toString().trim().toLowerCase();
  //         return ["yes", "true", "1"].includes(v)
  //             ? true
  //             : ["no", "false", "0"].includes(v)
  //                 ? false
  //                 : null; // invalid case
  //     }

  //     function parseDataProcessed(value) {
  //         if (!value) return [];
  //         return value
  //             .split(",")
  //             .map((v) => v.trim())
  //             .filter((v) => GENERAL.DATA_TYPES.includes(v));
  //     }

  //     return new Promise((resolve, reject) => {
  //         const rows = [];

  //         fs.createReadStream(filePath)
  //             .pipe(parse({ headers: true }))
  //             .on("error", (error) => reject(error))
  //             .on("data", (row) => {
  //                 rows.push({
  //                     process_name: row["Process Name"],
  //                     process_description: row["Process Description"],
  //                     senior_executive__owner_name: row["Senior Executive Name"],
  //                     senior_executive__owner_email: row["Senior Executive Email"],
  //                     operations__owner_name: row["Operations Owner Name"],
  //                     operations__owner_email: row["Operations Owner Email"],
  //                     technology_owner_name: row["Technology Owner Name"],
  //                     technology_owner_email: row["Technology Owner Email"],
  //                     organizational_revenue_impact_percentage: parseFloat(row["Oraganizational Revenue Impact Percentage"]),
  //                     financial_materiality: parseBoolean(row["Financial Materiality"]),
  //                     third_party_involvement: parseBoolean(row["Third Party Involvement"]),
  //                     users_customers: row["Users"],
  //                     regulatory_and_compliance: row["Regulatory and Compliance"],
  //                     criticality_of_data_processed: row["Criticality Of Data Processed"],
  //                     data_processed: parseDataProcessed(row["Data Processes"]),
  //                     status: "published"
  //                 });
  //             })
  //             .on("end", async () => {
  //                 try {
  //                     await Process.bulkCreate(rows, { ignoreDuplicates: true });
  //                     await sequelize.query(`
  //                     UPDATE "library_processes"
  //                     SET process_code = '#BP-' || LPAD(id::text, 5, '0')
  //                     WHERE process_code IS NULL;
  //                     `);
  //                     fs.unlinkSync(filePath);
  //                     resolve(rows.length);
  //                 } catch (err) {
  //                     reject(err);
  //                 }
  //             });
  //     });
  // };

  static async importProcessesFromCSV(filePath) {
    const [rows, details] = await sequelize.query(
      `select * from library_meta_datas where name ILIKE 'industry'`
    );

    const industryMetaData = rows[0];

    function parseBoolean(value) {
      if (!value) return null; // catch empty string or undefined
      const v = value.toString().trim().toLowerCase();
      return ["yes", "true", "1"].includes(v)
        ? true
        : ["no", "false", "0"].includes(v)
        ? false
        : null; // invalid case
    }

    function parseDataProcessed(value) {
      if (!value) return [];
      return value
        .split(",")
        .map((v) => v.trim())
        .filter((v) => GENERAL.DATA_TYPES.includes(v));
    }
    function parseRegulatoryAndCompliance(value) {
      if (!value) return [];
      return value.split(",");
    }

    function parseIndustry(value) {
      if (!value) return [];
      return value
        .split(",")
        .map((v) => v.trim())
        .filter((v) =>
          industryMetaData.supported_values.some(
            (supported) => supported.toLowerCase() === v.toLowerCase()
          )
        );
    }

    return new Promise((resolve, reject) => {
      const batchSize = 5000;
      let batch = [];
      let totalInserted = 0;

      fs.createReadStream(filePath)
        .pipe(parse({ headers: true }))
        .on("error", (error) => reject(error))
        .on("data", async (row) => {
          batch.push({
            process_name: row["Process Name"],
            process_description: row["Process Description"],
            senior_executive__owner_name: row["Senior Executive Name"],
            senior_executive__owner_email: row["Senior Executive Email"],
            operations__owner_name: row["Operations Owner Name"],
            operations__owner_email: row["Operations Owner Email"],
            technology_owner_name: row["Technology Owner Name"],
            technology_owner_email: row["Technology Owner Email"],
            organizational_revenue_impact_percentage: parseFloat(
              row["Oraganizational Revenue Impact Percentage"]
            ),
            financial_materiality: parseBoolean(row["Financial Materiality"]),
            third_party_involvement: parseBoolean(
              row["Third Party Involvement"]
            ),
            users_customers: row["Users"],
            regulatory_and_compliance: parseRegulatoryAndCompliance(
              row["Regulatory and Compliance"]
            ),
            criticality_of_data_processed: row["Criticality Of Data Processed"],
            data_processed: parseDataProcessed(row["Data Processes"]),
            status: "published",
            industry: parseIndustry(row["Industry"]),
          });

          if (batch.length >= batchSize) {
            // pause stream while DB writes
            this.pause();

            try {
              const inserted = await Process.bulkCreate(batch, {
                returning: true,
                ignoreDuplicates: true,
              });

              // Insert metadata
              const metaRows = inserted.map((process) => {
                const match = batch.find(
                  (b) => b.process_name === process.process_name
                );

                return {
                  process_id: process.id,
                  meta_data_key_id: industryMetaData.id,
                  values: match ? match.industry : null, // safe in case no match
                };
              });
              if (metaRows.length > 0) {
                await ProcessAttribute.bulkCreate(metaRows);
              }

              totalInserted += inserted.length;
              batch = []; // reset
            } catch (err) {
              reject(err);
            } finally {
              // resume stream after DB insert
              this.resume();
            }
          }
        })
        .on("end", async () => {
          try {
            // flush leftover rows
            if (batch.length > 0) {
              const inserted = await Process.bulkCreate(batch, {
                returning: true,
                ignoreDuplicates: true,
              });

              // Insert metadata

              const metaRows = inserted.map((process) => {
                const match = batch.find(
                  (b) => b.process_name === process.process_name
                );

                return {
                  process_id: process.id,
                  meta_data_key_id: industryMetaData.id,
                  values: match ? match.industry : null, // safe in case no match
                };
              });
              if (metaRows.length > 0) {
                await ProcessAttribute.bulkCreate(metaRows);
              }

              totalInserted += inserted.length;
            }

            await sequelize.query(`
                UPDATE "library_processes"
                SET process_code = 'BP' || LPAD(id::text, 5, '0')
                WHERE process_code IS NULL;
              `);

            fs.unlinkSync(filePath);
            resolve(totalInserted);
          } catch (err) {
            reject(err);
          }
        });
    });
  }

  static validateProcessData = (data) => {
    const { process_name, status } = data;

    if (!process_name) {
      throw new CustomError(
        Messages.PROCESS.PROCESS_NAME_REQUIRED,
        HttpStatus.BAD_REQUEST
      );
    }

    if (
      !status ||
      (status && !GENERAL.STATUS_SUPPORTED_VALUES.includes(status))
    ) {
      throw new CustomError(
        Messages.PROCESS.INVALID_VALUE,
        HttpStatus.BAD_REQUEST
      );
    }
  };

  static handleProcessDataColumnMapping(data) {
    const fields = [
      "process_name",
      "process_description",
      "senior_executive__owner_name",
      "senior_executive__owner_email",
      "operations__owner_name",
      "operations__owner_email",
      "technology_owner_name",
      "technology_owner_email",
      "organizational_revenue_impact_percentage",
      "financial_materiality",
      "third_party_involvement",
      "users_customers",
      "regulatory_and_compliance",
      "criticality_of_data_processed",
      "data_processed",
      "status",
    ];

    return Object.fromEntries(
      fields.map((key) => [key, data[key] === "" ? null : data[key]])
    );
  }

  static async handleProcessDependencies(
    operationType = "create",
    sourceProcessId,
    dependencies,
    transaction
  ) {
    for (const dependency of dependencies) {
      console.log(dependency, "DEPE");
      if (
        !dependency.relationship_type ||
        !PROCESS.PROCESS_RELATIONSHIP_TYPES.includes(
          dependency.relationship_type
        )
      ) {
        console.log("Invalid relationship type in dependency:", dependency);
        throw new CustomError(
          Messages.PROCESS.INVALID_RELATIONSHIP_TYPE,
          HttpStatus.BAD_REQUEST
        );
      }

      if (
        !dependency.target_process_id 
      ) {
        console.log("Invalid or missing target_process_id:", dependency);
        throw new CustomError(
          Messages.PROCESS.MISSING_TARGET_ID,
          HttpStatus.BAD_REQUEST
        );
      }

      if (operationType == "update") {
        console.log(dependency.source_process_id);
        const sourceProcess = await Process.findByPk(
          dependency.source_process_id
        );
        if (!sourceProcess) {
          console.log(
            "Source process not found:",
            dependency.source_process_id
          );
          throw new CustomError(
            Messages.PROCESS.SOURCE_NOT_FOUND,
            HttpStatus.NOT_FOUND
          );
        }
      } else {
        dependency.source_process_id = sourceProcessId;
      }
      const targetProcess = await Process.findByPk(
        dependency.target_process_id
      );
      if (!targetProcess) {
        console.log("Target process not found:", dependency.target_process_id);
        throw new CustomError(
          Messages.PROCESS.TARGET_NOT_FOUND,
          HttpStatus.NOT_FOUND
        );
      }

      await ProcessRelationship.upsert(
        {
          source_process_id: dependency.source_process_id,
          target_process_id: dependency.target_process_id,
          relationship_type: dependency.relationship_type,
        },
        { transaction }
      );
    }
  }

  static async handleProcessAttributes(processId, attributes, transaction) {
    for (const attr of attributes) {
      if (!attr.meta_data_key_id || !attr.values) {
        console.log("Missing meta_data_key_id or values:", attr);
        throw new CustomError(
          Messages.PROCESS.MISSING_ATTRIBUTE_FIELD,
          HttpStatus.BAD_REQUEST
        );
      }

      const metaData = await MetaData.findByPk(attr.meta_data_key_id, {
        transaction,
      });
      if (!metaData) {
        console.log("MetaData not found:", attr.meta_data_key_id);
        throw new CustomError(
          Messages.PROCESS.METADATA_NOT_FOUND,
          HttpStatus.NOT_FOUND
        );
      }

      const supportedValues = metaData.supported_values;
      if (
        supportedValues?.length > 0 &&
        !attr.values.every((v) => supportedValues.includes(v))
      ) {
        console.log("Unsupported values in attribute:", attr);
        throw new CustomError(
          Messages.PROCESS.INVALID_ATTRIBUTE_VALUE,
          HttpStatus.BAD_REQUEST
        );
      }

      await ProcessAttribute.create(
        {
          process_id: processId,
          meta_data_key_id: attr.meta_data_key_id,
          values: attr.values,
        },
        { transaction }
      );
    }
  }

  // Function to generate Sequelize where conditions
  static async handleProcessFilters(
    searchPattern = null,
    statusFilter = [],
    attrFilters = []
  ) {
    const conditions = [];

    if (searchPattern) {
      conditions.push({
        [Op.or]: [
          { process_name: { [Op.iLike]: `%${searchPattern}%` } },
          { process_description: { [Op.iLike]: `%${searchPattern}%` } },
        ],
      });
    }

    if (statusFilter.length > 0) {
      conditions.push({ status: { [Op.in]: statusFilter } });
    }

    // Attribute filters
    if (attrFilters.length > 0) {
      const processColumns = Object.keys(Process.rawAttributes);
      const processWhere = [];
      const mappingFilters = [];

      // Separate filters: direct columns vs mapping table
      attrFilters.forEach((f) => {
        if (processColumns.includes(f.filterName)) {
          // Direct column filter
          const columnType = Process.rawAttributes[f.filterName].type.key;
          if (columnType === "ARRAY") {
            processWhere.push({ [f.filterName]: { [Op.overlap]: f.values } });
          } else {
            processWhere.push({ [f.filterName]: { [Op.in]: f.values } });
          }
        } else {
          mappingFilters.push(f);
        }
      });

      // Add direct column filters
      if (processWhere.length > 0) {
        conditions.push({ [Op.and]: processWhere });
      }

      // Handle mapping table filters
      if (mappingFilters.length > 0) {
        // Fetch meta_data_key_ids for given names
        const metaNames = mappingFilters.map((f) => f.filterName);
        const metaDataKeys = await MetaData.findAll({
          where: { name: { [Op.in]: metaNames } },
          attributes: ["id", "name"],
        });

        const metaMap = {};
        metaDataKeys.forEach((m) => (metaMap[m.name] = m.id));

        // Build INTERSECT subquery
        let subquery = "";
        mappingFilters.forEach((filter, idx) => {
          const metaDataKeyId = metaMap[filter.filterName];
          if (!metaDataKeyId)
            throw new Error(`Invalid meta_data_key name: ${filter.filterName}`);

          const valuesArray = filter.values
            .map((v) => sequelize.escape(v))
            .join(",");
          if (idx > 0) subquery += " INTERSECT ";
          subquery += `
          SELECT "process_id"
          FROM library_attributes_process_mapping
          WHERE "meta_data_key_id" = '${metaDataKeyId}'::uuid
          AND "values" && ARRAY[${valuesArray}]::varchar[]
        `;
        });

        conditions.push({
          id: { [Op.in]: Sequelize.literal(`(${subquery})`) },
        });
      }
    }

    return conditions.length > 0 ? { [Op.and]: conditions } : {};
  }

}

module.exports = ProcessService;
