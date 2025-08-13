const {
    MetaData,
    sequelize,
    Process,
    Asset,
    AssetAttribute,
    AssetProcessMappings
} = require("../models");
const { Op } = require("sequelize");
const CustomError = require("../utils/CustomError");
const HttpStatus = require("../constants/httpStatusCodes");
const Messages = require("../constants/messages");
const {ASSETS, GENERAL } = require("../constants/library");



class AssetService {
    static async createAsset(data) {

        return await sequelize.transaction(async (t) => {
            
            console.log("[createAsset] Creating asset", data);
            
            this.validateAssetData(data);

            const assetData = this.handleAssetDataColumnMapping(data);

            console.log("[createAsset], asset creation mapped values", assetData);

            const asset = await Asset.create(assetData, { transaction: t });

            await this.handleAssetProcessMapping(asset.id, data.related_processes ?? [], t);

            await this.handleAssetAttributes(asset.id, data.attributes ?? [], t);

            return asset;
        });
    }

    static async getAllAssets(page = 0, limit = 6,  searchPattern = null, sortBy = 'created_at', sortOrder = 'ASC') {
        const offset = page * limit;
        let whereClause = {};
        console.log(sortOrder)

        if (!ASSETS.ASSET_ALLOWED_SORT_FILED.includes(sortBy)) {
            sortBy = "created_at";
        }

        if (!GENERAL.ALLOWED_SORT_ORDER.includes(sortOrder)) {
            sortOrder = 'ASC';
        }

        if (searchPattern) {
          whereClause = {
            [Op.or]: [
              { application_name: { [Op.iLike]: `%${searchPattern}%` } },
              { third_party_name: { [Op.iLike]: `%${searchPattern}%` } },
              { cloud_service_provider: { [Op.iLike]: `%${searchPattern}%` } },
              { geographic_location: { [Op.iLike]: `%${searchPattern}%` } },

            ],
          };
        }

        const total = await Asset.count({
            where: whereClause
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
            asset.industry = asset.attributes?.filter((a) => a.metaData?.name?.toLowerCase() === "industry")?.flatMap((a) => a.values);
            asset.domain = asset.attributes?.filter((a) => a.metaData?.name?.toLowerCase() === "domain")?.flatMap((a) => a.values);
            asset.attributes = asset.attributes.map((a) => ({ meta_data_key_id: a.meta_data_key_id, values: a.values }));
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
        console.log(asset)

        if (!asset) {
            console.log("Asset not found with id", id);
            throw new CustomError(Messages.ASSET.NOT_FOUND(id), HttpStatus.NOT_FOUND);
        }

        return asset;
    }

    static async updateAsset(id, data) {
        console.log("request received for updating asset", data);

        this.validateAssetData(data)

        return await sequelize.transaction(async (t) => {
            const asset = await Asset.findByPk(id, { transaction: t });

            if (!asset) {
                throw new CustomError(Messages.ASSET.NOT_FOUND(id), HttpStatus.NOT_FOUND);
            }

            this.validateAssetData(data);

            const assetData = this.handleAssetDataColumnMapping(data);

            const updatedAsset = await asset.update(assetData, { transaction: t });

            await AssetAttribute.destroy({ where: { asset_id: id }, transaction: t });
            await AssetProcessMappings.destroy({ where: { asset_id: id }, transaction: t });

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

        if (!STATUS_SUPPORTED_VALUES.includes(status)) {
            console.log("[updateRiskScenarioStatus] Invalid status:", id, status);
            throw new CustomError(Messages.RISK_SCENARIO.INVALID_STATUS, HttpStatus.BAD_REQUEST);
        }

        const [updatedRowsCount] = await Asset.update({ status }, { where: { id } });

        if (updatedRowsCount === 0) {
            console.log("[updateAssetStatus] Not found:", id);
            throw new CustomError(Messages.ASSET.NOT_FOUND(id), HttpStatus.NOT_FOUND);
        }

        console.log("[updateAssetStatus] Updated:", id, status);
        return { message: Messages.ASSET.STATUS_UPDATED };
    }


    static validateAssetData = (data) => {
    const { application_name, status } = data;

    if (!application_name) {
        throw new CustomError(Messages.ASSET.APPLICATION_NAME_REQUIRED, HttpStatus.BAD_REQUEST);
    }

    if (status && !GENERAL.STATUS_SUPPORTED_VALUES.includes(status)) {
        throw new CustomError(Messages.LIBARY.INVALID_STATUS_VALUE, HttpStatus.BAD_REQUEST);
    }
    };

    static handleAssetDataColumnMapping(data) {
        const fields = [
            "application_name",
            "application_owner",
            "application_it_owner",
            "third_party_management",
            "third_party_name",
            "third_party_location",
            "hosting",
            "hosting_facility",
            "cloud_service_provider",
            "geographic_location",
            "redundancy",
            "databases",
            "network_segmentation",
            "network_name",
            "asset_category",
            "asset_name",
            "asset_description",
            "status"
        ];

        return Object.fromEntries(fields.map((key) => [key, data[key]]));
    }

    static async handleAssetProcessMapping(assetId, relatedProcesses, transaction) {
        if (Array.isArray(relatedProcesses)) {
                for (const process of relatedProcesses) {
                    if (typeof process !== "number" || process < 0) {
                        console.log("[createAsset] Invalid related process:", process);
                        throw new CustomError(Messages.ASSET.INVALID_PROCESS_MAPPING, HttpStatus.BAD_REQUEST);
                    }

                    const processData = await Process.findByPk(process);
                    if (!processData) {
                        console.log("[createAsset] Related process not found:", process);
                        throw new CustomError(Messages.ASSET.INVALID_PROCESS_MAPPING, HttpStatus.NOT_FOUND);
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
                throw new CustomError(Messages.LIBARY.MISSING_ATTRIBUTE_FIELD, HttpStatus.BAD_REQUEST);
            }

            const metaData = await MetaData.findByPk(attr.meta_data_key_id, { transaction });
            if (!metaData) {
                console.log("MetaData not found:", attr.meta_data_key_id);
                throw new CustomError(Messages.LIBARY.METADATA_NOT_FOUND, HttpStatus.NOT_FOUND);
            }

            const supportedValues = metaData.supported_values;
            if (supportedValues?.length > 0 && !attr.values.every((v) => supportedValues.includes(v))) {
                console.log("Unsupported values in attribute:", attr);
                throw new CustomError(Messages.LIBARY.INVALID_ATTRIBUTE_VALUE, HttpStatus.BAD_REQUEST);
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
}

module.exports = AssetService;