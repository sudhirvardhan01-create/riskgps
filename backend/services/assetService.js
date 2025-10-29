const {
  MetaData,
  sequelize,
  Process,
  Asset,
  AssetAttribute,
  AssetProcessMappings,
  Sequelize,
  MitreThreatControl,
} = require("../models");
const { Op, where } = require("sequelize");
const CustomError = require("../utils/CustomError");
const HttpStatus = require("../constants/httpStatusCodes");
const Messages = require("../constants/messages");
const { ASSETS, GENERAL } = require("../constants/library");
const { format } = require("@fast-csv/format");
const QueryStream = require("pg-query-stream");
const fs = require("fs");
const { parse } = require("fast-csv");

class AssetService {
  static async createAsset(data) {
    return await sequelize.transaction(async (t) => {
      console.log("[createAsset] Creating asset", data);

      this.validateAssetData(data);

      const assetData = this.handleAssetDataColumnMapping(data);

      console.log("[createAsset], asset creation mapped values", assetData);

      const asset = await Asset.create(assetData, { transaction: t });

      await this.handleAssetProcessMapping(
        asset.id,
        data.related_processes ?? [],
        t
      );

      await this.handleAssetAttributes(asset.id, data.attributes ?? [], t);

      return asset;
    });
  }

  static async getAllAssets(
    page = 0,
    limit = -1,
    searchPattern = null,
    sortBy = "created_at",
    sortOrder = "ASC",
    statusFilter = [],
    attrFilters = []
  ) {
    const offset = page * limit;

    if (!ASSETS.ASSET_ALLOWED_SORT_FILED.includes(sortBy)) {
      sortBy = "created_at";
    }

    if (!GENERAL.ALLOWED_SORT_ORDER.includes(sortOrder)) {
      sortOrder = "ASC";
    }

    const whereClause = await this.handleAssetFilters(
      searchPattern,
      statusFilter,
      attrFilters
    );

    const total = await Asset.count({
      where: whereClause,
    });

    const data = await Asset.findAll({
      ...(limit > 0 ? { limit, offset } : {}),
      offset,
      order: [[sortBy, sortOrder]],
      where: whereClause,
      include: [
        {
          model: AssetAttribute,
          as: "attributes",
          include: [{ model: MetaData, as: "metaData" }],
        },
        { model: Process, as: "processes" },
      ],
    });

    const assets = data.map((s) => {
      const asset = s.toJSON();
      asset.industry = asset.attributes
        ?.filter((a) => a.metaData?.name?.toLowerCase() === "industry")
        ?.flatMap((a) => a.values);
      asset.domain = asset.attributes
        ?.filter((a) => a.metaData?.name?.toLowerCase() === "domain")
        ?.flatMap((a) => a.values);
      asset.attributes = asset.attributes.map((a) => ({
        meta_data_key_id: a.meta_data_key_id,
        values: a.values,
      }));
      asset.related_processes = asset.processes.map((p) => p.id);
      delete asset.processes;
      return asset;
    });

    return {
      data: assets,
      total,
      page,
      limit: limit > 0 ? limit : total,
      totalPages: limit> 0 ? Math.ceil(total / limit) : 1,
    };
  }

  static async getAssetById(id) {
    const asset = await Asset.findByPk(id, {
      include: [
        {
          model: Process,
          as: "processes",
          attributes: [
            "id",
            "processCode",
            "processName",
            "processDescription",
            "status",
          ],
          include: [],
          through: { attributes: [] },
        },
        {
          model: AssetAttribute,
          as: "attributes",
          include: [{ model: MetaData, as: "metaData" }],
        },
      ],
    });

    if (!asset) {
      console.log("Asset not found with id", id);
      throw new CustomError(Messages.ASSET.NOT_FOUND(id), HttpStatus.NOT_FOUND);
    }
    const assetData = asset.toJSON();
    const assetCategory = assetData.assetCategory;
    if (assetCategory) {
      const mitreThreatControls = await MitreThreatControl.findAll({
        where: {
          platforms: {
            [Op.contains]: [assetCategory],
          },
        },
        attributes: [
          "id",
          "platforms",
          "mitreTechniqueId",
          "mitreTechniqueName",
          "subTechniqueId",
          "subTechniqueName",
          "mitreControlId",
          "mitreControlName",
          "controlPriority",
        ],
      });
      assetData.mitreControls = mitreThreatControls;
    }

    return assetData;
  }

  static async updateAsset(id, data) {
    console.log("request received for updating asset", data);

    this.validateAssetData(data);

    return await sequelize.transaction(async (t) => {
      const asset = await Asset.findByPk(id, { transaction: t });

      if (!asset) {
        throw new CustomError(
          Messages.ASSET.NOT_FOUND(id),
          HttpStatus.NOT_FOUND
        );
      }

      this.validateAssetData(data);

      const assetData = this.handleAssetDataColumnMapping(data);

      const updatedAsset = await asset.update(assetData, { transaction: t });

      await AssetAttribute.destroy({ where: { asset_id: id }, transaction: t });

      await AssetProcessMappings.destroy({
        where: { asset_id: id },
        transaction: t,
      });

      await this.handleAssetProcessMapping(id, data.related_processes ?? [], t);

      await this.handleAssetAttributes(id, data.attributes ?? [], t);

      return updatedAsset;
    });
  }

  static async deleteAssetById(id) {
    const asset = await Asset.findByPk(id);

    if (!asset) {
      console.log("[deleteAssetById] Not found:", id);
      throw new CustomError(Messages.ASSET.NOT_FOUND(id), HttpStatus.NOT_FOUND);
    }

    await asset.destroy();
    return { message: Messages.ASSET.DELETED };
  }

  static async updateAssetStatus(id, status) {
    if (!GENERAL.STATUS_SUPPORTED_VALUES.includes(status)) {
      console.log("[updateRiskScenarioStatus] Invalid status:", id, status);
      throw new CustomError(
        Messages.RISK_SCENARIO.INVALID_STATUS,
        HttpStatus.BAD_REQUEST
      );
    }

    const [updatedRowsCount] = await Asset.update(
      { status },
      { where: { id } }
    );

    if (updatedRowsCount === 0) {
      console.log("[updateAssetStatus] Not found:", id);
      throw new CustomError(Messages.ASSET.NOT_FOUND(id), HttpStatus.NOT_FOUND);
    }

    console.log("[updateAssetStatus] Updated:", id, status);
    return { message: Messages.ASSET.STATUS_UPDATED };
  }

  static async downloadAssetTemplateFile(res) {
    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=asset_template.csv"
    );

    const csvStream = format({ headers: true });
    csvStream.pipe(res);

    // Row 1: Clarifications / Instructions
    csvStream.write({
      "Application Name": "Enter application name (text)",
      "Application Owner": "Person/Dept responsible",
      "Application IT Owner": "IT owner name",
      "Is Third Party Management": "Yes / No",
      "Third Party Name": "If Yes above, enter vendor name",
      "Third Party Location": "Vendor location (e.g., USA)",
      Hosting:
        "Supported Value from the List " +
        ASSETS.HOSTING_SUPPORTED_VALUES.join(" / "),
      "Hosting Facility":
        "Supported Value from the List " +
        ASSETS.HOSTING_FACILITY_SUPPORTED_VALUES.join(" / "),
      "Cloud Service Provider":
        "Values separated by comma " +
        ASSETS.CLOUD_SERVICE_PROVIDERS_SUPPORTED_VALUES.join(" / "),
      "Geographic Location": "Primary location (e.g., US-East, EU-West)",
      "Has Redundancy": "Yes / No",
      Databases: "List (comma-separated, e.g., MySQL, PostgreSQL)",
      "Has Network Segmentations": "Yes / No",
      "Network Name": "Network identifier (if applicable)",
      "Asset Category":
        "A single Value from the list " + ASSETS.ASSET_CATEGORY.join(","),
      "Asset Description": "Short description of the asset",
    });

    csvStream.end();
  }

  static async importAssetFromCSV(filePath) {
    function parseBoolean(value) {
      if (!value) return null; // catch empty string or undefined
      const v = value.toString().trim().toLowerCase();
      return ["yes", "true", "1"].includes(v)
        ? true
        : ["no", "false", "0"].includes(v)
        ? false
        : null; // invalid case
    }

    function parseHosting(value) {
      if (!value) return null;
      const v = value.trim();
      return ASSETS.HOSTING_SUPPORTED_VALUES.includes(v) ? v : null;
    }

    function parseHostingFacility(value) {
      if (!value) return null;
      const v = value.trim();
      return ASSETS.HOSTING_FACILITY_SUPPORTED_VALUES.includes(v) ? v : null;
    }

    function parseCloudServiceProvider(value) {
      if (!value) return [];
      return value
        .split(",") // split by comma
        .map((v) => v.trim()) // remove whitespace
        .filter((v) =>
          ASSETS.CLOUD_SERVICE_PROVIDERS_SUPPORTED_VALUES.includes(v)
        );
    }

    function parseAssetCategory(value) {
      if (!value) return null;
      const v = value.trim();
      return ASSETS.ASSET_CATEGORY.includes(v) ? v : null;
    }

    return new Promise((resolve, reject) => {
      const rows = [];

      fs.createReadStream(filePath)
        .pipe(parse({ headers: true }))
        .on("error", (error) => reject(error))
        .on("data", (row) => {
          rows.push({
            applicationName: row["Application Name"],
            applicationOwner: row["Application Owner"],
            applicationItOwner: row["Application IT Owner"],
            isThirdPartyManagement: parseBoolean(
              row["Is Third Party Management"]
            ),
            thirdPartyName: row["Third Party Name"],
            thirdPartyLocation: row["Third Party Location"],
            hosting: parseHosting(row["Hosting"]),
            hostingFacility: parseHostingFacility(row["Hosting Facility"]),
            cloudServiceProvider: parseCloudServiceProvider(
              row["Cloud Service Provider"]
            ),
            geographicLocation: row["Geographic Location"],
            hasRedundancy: parseBoolean(row["Has Redundancy"]),
            databases: row["Databases"],
            hasNetworkSegmentation: parseBoolean(
              row["Has Network Segmentations"]
            ),
            networkName: row["Network Name"],
            assetCategory: parseAssetCategory(row["Asset Category"]),
            assetDescription: row["Asset Description"],
            status: "published",
          });
        })
        .on("end", async () => {
          try {
            await Asset.bulkCreate(rows, { ignoreDuplicates: true });
            await sequelize.query(`
                        UPDATE "library_assets"
                        SET asset_code = 'AT' || LPAD(id::text, 5, '0')
                        WHERE asset_code IS NULL;
                        `);
            fs.unlinkSync(filePath);
            resolve(rows.length);
          } catch (err) {
            reject(err);
          }
        });
    });
  }

  static async exportAssetsCSV(res) {
    const connection = await sequelize.connectionManager.getConnection();

    try {
      const sql = `
            SELECT *
            FROM library_assets
            ORDER BY created_at DESC
            `;

      const query = new QueryStream(sql);
      const stream = connection.query(query);

      res.setHeader(
        "Content-disposition",
        "attachment; filename=assets_export.csv"
      );
      res.setHeader("Content-Type", "text/csv");

      const csvStream = format({
        headers: true,
        transform: (row) => ({
          "Asset ID": row.asset_code,
          "Application Name": row.application_name,
          "Application Owner": row.application_owner,
          "Application IT Owner": row.application_it_owner,
          "Is Third Party Management": row.is_third_party_management,
          "Third Party Name": row.third_party_name,
          "Third Party Location": row.third_party_location,
          Hosting: row.hosting,
          "Hosting Facility": row.hosting_facility,
          "Cloud Service Provider": (row.cloud_service_provider ?? []).join(
            ","
          ),
          "Geographic Location": row.geographic_location,
          "Has Redundancy": row.has_redundancy,
          Databases: row.databases,
          "Has Network Segmentations": row.has_network_segmentation,
          "Network Name": row.network_name,
          "Asset Category": row.asset_category,
          "Asset Description": row.asset_description,
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

  static validateAssetData(data) {
    const {
      applicationName,
      status,
      hosting,
      hostingFacility,
      cloudServiceProvider,
      assetCategory,
    } = data;

    if (!applicationName) {
      throw new CustomError(
        Messages.ASSET.APPLICATION_NAME_REQUIRED,
        HttpStatus.BAD_REQUEST
      );
    }

    if (
      !status ||
      (status && !GENERAL.STATUS_SUPPORTED_VALUES.includes(status))
    ) {
      throw new CustomError(
        Messages.LIBARY.INVALID_STATUS_VALUE,
        HttpStatus.BAD_REQUEST
      );
    }

    if (hosting && !ASSETS.HOSTING_SUPPORTED_VALUES.includes(hosting)) {
      throw new CustomError(
        Messages.ASSET.INVALID_HOSTING_VALUE,
        HttpStatus.BAD_REQUEST
      );
    }

    if (
      hostingFacility &&
      !ASSETS.HOSTING_FACILITY_SUPPORTED_VALUES.includes(hostingFacility)
    ) {
      throw new CustomError(
        Messages.ASSET.INVALID_HOSTING_FACILITY_VALUE,
        HttpStatus.BAD_REQUEST
      );
    }

    if (cloudServiceProvider) {
      if (
        !Array.isArray(cloudServiceProvider) ||
        !cloudServiceProvider.every((p) =>
          ASSETS.CLOUD_SERVICE_PROVIDERS_SUPPORTED_VALUES.includes(p)
        )
      ) {
        throw new CustomError(
          Messages.ASSET.INVALID_CLOUD_SERVICE_PROVIDER,
          HttpStatus.BAD_REQUEST
        );
      }
    }

    if (!assetCategory || !ASSETS.ASSET_CATEGORY.includes(assetCategory)) {
      throw new CustomError(
        Messages.ASSET.INVALID_ASSET_CATEGORY,
        HttpStatus.BAD_REQUEST
      );
    }
  }

  static handleAssetDataColumnMapping(data) {
    const fields = [
      "applicationName",
      "applicationOwner",
      "applicationItOwner",
      "isThirdPartyManagement",
      "thirdPartyName",
      "thirdPartyLocation",
      "hosting",
      "hostingFacility",
      "cloudServiceProvider",
      "geographicLocation",
      "hasRedundancy",
      "databases",
      "hasNetworkSegmentation",
      "networkName",
      "assetCategory",
      "assetDescription",
      "status",
    ];

    return Object.fromEntries(
      fields.map((key) => [key, data[key] === "" ? null : data[key]])
    );
  }

  static async handleAssetProcessMapping(
    assetId,
    relatedProcesses,
    transaction
  ) {
    if (Array.isArray(relatedProcesses)) {
      for (const process of relatedProcesses) {
        if (typeof process !== "string") {
          console.log("[createAsset] Invalid related process:", process);
          throw new CustomError(
            Messages.ASSET.INVALID_PROCESS_MAPPING,
            HttpStatus.BAD_REQUEST
          );
        }

        const processData = await Process.findByPk(process);
        if (!processData) {
          console.log("[createAsset] Related process not found:", process);
          throw new CustomError(
            Messages.ASSET.INVALID_PROCESS_MAPPING,
            HttpStatus.NOT_FOUND
          );
        }

        await AssetProcessMappings.create(
          {
            asset_id: assetId,
            process_id: process,
          },
          { transaction }
        );
      }
    }
  }

  static async handleAssetAttributes(assetId, attributes, transaction) {
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
        throw new CustomError(
          Messages.LIBARY.INVALID_ATTRIBUTE_VALUE,
          HttpStatus.BAD_REQUEST
        );
      }

      await AssetAttribute.create(
        {
          asset_id: assetId,
          meta_data_key_id: attr.meta_data_key_id,
          values: attr.values,
        },
        { transaction }
      );
    }
  }

  // Function to generate Sequelize where conditions
  static async handleAssetFilters(
    searchPattern = null,
    statusFilter = [],
    attrFilters = []
  ) {
    const conditions = [];

    if (searchPattern) {
      conditions.push({
        [Op.or]: [
          { applicationName: { [Op.iLike]: `%${searchPattern}%` } },
          { thirdPartyName: { [Op.iLike]: `%${searchPattern}%` } },
          { geographicLocation: { [Op.iLike]: `%${searchPattern}%` } },
        ],
      });
    }

    if (statusFilter.length > 0) {
      conditions.push({ status: { [Op.in]: statusFilter } });
    }

    // Attribute filters
    if (attrFilters.length > 0) {
      const assetColumns = Object.keys(Asset.rawAttributes);
      const assetWhere = [];
      const mappingFilters = [];

      // Separate filters: direct columns vs mapping table
      attrFilters.forEach((f) => {
        if (assetColumns.includes(f.filterName)) {
          // Direct column filter
          const columnType = Asset.rawAttributes[f.filterName].type.key;
          if (columnType === "ARRAY") {
            assetWhere.push({ [f.filterName]: { [Op.overlap]: f.values } });
          } else {
            assetWhere.push({ [f.filterName]: { [Op.in]: f.values } });
          }
        } else {
          mappingFilters.push(f);
        }
      });

      // Add direct column filters
      if (assetWhere.length > 0) {
        conditions.push({ [Op.and]: assetWhere });
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
          SELECT "asset_id"
          FROM library_attributes_asset_mapping
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

module.exports = AssetService;
