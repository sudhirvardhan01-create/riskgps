const {
  MetaData,
  sequelize,
  Process,
  Asset,
  AssetAttribute,
  AssetProcessMappings,
  Sequelize,
} = require("../models");
const { Op } = require("sequelize");
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
    limit = 6,
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

    const whereClause = this.handleAssetFilters(
      searchPattern,
      statusFilter,
      attrFilters
    );

    const total = await Asset.count({
      where: whereClause,
    });
    const data = await Asset.findAll({
      limit,
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
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  static async getAssetById(id) {
    const asset = await Asset.findByPk(id, {
      include: [
        {
          model: AssetAttribute,
          as: "attributes",
          include: [{ model: MetaData, as: "metaData" }],
        },
      ],
    });
    console.log(asset);

    if (!asset) {
      console.log("Asset not found with id", id);
      throw new CustomError(Messages.ASSET.NOT_FOUND(id), HttpStatus.NOT_FOUND);
    }

    return asset;
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
      "Hosting": "Supported Value from the List " + ASSETS.HOSTING_SUPPORTED_VALUES.join(" / "),
      "Hosting Facility": "Supported Value from the List " + ASSETS.HOSTING_FACILITY_SUPPORTED_VALUES.join(" / "),
      "Cloud Service Provider": "Values separated by comma " + ASSETS.CLOUD_SERVICE_PROVIDERS_SUPPORTED_VALUES.join(" / "),
      "Geographic Location": "Primary location (e.g., US-East, EU-West)",
      "Has Redundancy": "Yes / No",
      "Databases": "List (comma-separated, e.g., MySQL, PostgreSQL)",
      "Has Network Segmentations": "Yes / No",
      "Network Name": "Network identifier (if applicable)",
      "Asset Category": "A single Value from the list " + ASSETS.ASSET_CATEGORY.join(","),
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
        .filter((v) => ASSETS.CLOUD_SERVICE_PROVIDERS_SUPPORTED_VALUES.includes(v));
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
            application_name: row["Application Name"],
            application_owner: row["Application Owner"],
            application_it_owner: row["Application IT Owner"],
            is_third_party_management: parseBoolean(row["Is Third Party Management"]),
            third_party_name: row["Third Party Name"],
            third_party_location: row["Third Party Location"],
            hosting: parseHosting(row["Hosting"]),
            hosting_facility: parseHostingFacility(row["Hosting Facility"]),
            cloud_service_provider: parseCloudServiceProvider(row["Cloud Service Provider"]),
            geographic_location: row["Geographic Location"],
            has_redundancy: parseBoolean(row["Has Redundancy"]),
            databases: row["Databases"],
            has_network_segmentation: parseBoolean(row["Has Network Segmentations"]),
            network_name: row["Network Name"],
            asset_category: parseAssetCategory(row["Asset Category"]),
            asset_description: row["Asset Description"],
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

      res.setHeader("Content-disposition", "attachment; filename=assets_export.csv");
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
          "Hosting": row.hosting,
          "Hosting Facility": row.hosting_facility,
          "Cloud Service Provider": (row.cloud_service_provider ?? []).join(","),
          "Geographic Location": row.geographic_location,
          "Has Redundancy": row.has_redundancy,
          "Databases": row.databases,
          "Has Network Segmentations": row.has_network_segmentation,
          "Network Name": row.network_name,
          "Asset Category": row.asset_category,
          "Asset Description": row.asset_description,
          "Status": row.status,
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
      application_name,
      status,
      hosting,
      hosting_facility,
      cloud_service_provider,
      asset_category,
    } = data;

    if (!application_name) {
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
      hosting_facility &&
      !ASSETS.HOSTING_FACILITY_SUPPORTED_VALUES.includes(hosting_facility)
    ) {
      throw new CustomError(
        Messages.ASSET.INVALID_HOSTING_FACILITY_VALUE,
        HttpStatus.BAD_REQUEST
      );
    }

    if (cloud_service_provider) {
      if (
        !Array.isArray(cloud_service_provider) ||
        !cloud_service_provider.every((p) =>
          ASSETS.CLOUD_SERVICE_PROVIDERS_SUPPORTED_VALUES.includes(p)
        )
      ) {
        throw new CustomError(
          Messages.ASSET.INVALID_CLOUD_SERVICE_PROVIDER,
          HttpStatus.BAD_REQUEST
        );
      }
    }

    if (!asset_category || !ASSETS.ASSET_CATEGORY.includes(asset_category)) {
      throw new CustomError(
        Messages.ASSET.INVALID_ASSET_CATEGORY,
        HttpStatus.BAD_REQUEST
      );
    }
  }

  static handleAssetDataColumnMapping(data) {
    const fields = [
      "application_name",
      "application_owner",
      "application_it_owner",
      "is_third_party_management",
      "third_party_name",
      "third_party_location",
      "hosting",
      "hosting_facility",
      "cloud_service_provider",
      "geographic_location",
      "has_redundancy",
      "databases",
      "has_network_segmentation",
      "network_name",
      "asset_category",
      "asset_name",
      "asset_description",
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
        if (typeof process !== "number" || process < 0) {
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
        console.log("Unsupported values in attribute:", attr);
        console.log("aaabb");
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

  static handleAssetFilters(
    searchPattern = null,
    statusFilter = [],
    attrFilters = []
  ) {
    let conditions = [];

    if (searchPattern) {
      conditions.push({
        [Op.or]: [
          { application_name: { [Op.iLike]: `%${searchPattern}%` } },
          { third_party_name: { [Op.iLike]: `%${searchPattern}%` } },
          { geographic_location: { [Op.iLike]: `%${searchPattern}%` } },
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
                SELECT "asset_id"
                FROM library_attributes_asset_mapping
                WHERE "meta_data_key_id" = ${metaDataKeyId}
                AND "values" && ARRAY[${valuesArray}]::varchar[]
            `;
      });

      conditions.push({ id: { [Op.in]: Sequelize.literal(`(${subquery})`) } });
    }
    return conditions.length > 0 ? { [Op.and]: conditions } : {};
  }
}

module.exports = AssetService;
