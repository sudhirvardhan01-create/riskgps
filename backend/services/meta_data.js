const { Op } = require("sequelize");
const { MetaData } = require("../models");
const CustomError = require("../utils/CustomError");
const HttpStatus = require("../constants/httpStatusCodes");
const MESSAGES = require("../constants/messages");
const { META_DATA, GENERAL } = require("../constants/library");


class MetaDataService {
    static async createMetaData(data) {
        console.log("Received request for creating meta data", data);

        const requiredFields = ["name", "label", "supported_values"];
        for (const field of requiredFields) {
            if (!data[field]) {
                console.log(`Missing required field: ${field}`);
                throw new CustomError(
                    `${MESSAGES.GENERAL.REQUIRED_FIELD_MISSING}: ${field}`,
                    HttpStatus.BAD_REQUEST
                );
            }
        }

        const validInputTypes = ["text", "select", "multiselect", "number"];
        if (!validInputTypes.includes(data.input_type)) {
            console.log(`Invalid input_type: ${data.input_type}`);
            throw new CustomError(
                MESSAGES.META_DATA.INVALID_INPUT_TYPE,
                HttpStatus.BAD_REQUEST
            );
        }

        const validAppliesToField = ["all", "risk_scenario", "process", "threat", "asset", "control"];
        if (!data.applies_to.every(value => validAppliesToField.includes(value))) {
            console.log(`Invalid value for applies_to: ${data.applies_to}`);
            throw new CustomError(
                MESSAGES.META_DATA.INVALID_APPLIES_TO,
                HttpStatus.BAD_REQUEST
            );
        }

        const metadata = await MetaData.create(data);
        console.log("Meta data created successfully");
        return {
            data: metadata,
            message: MESSAGES.META_DATA.CREATED
        };
    }

    static async getAllMetaData(page = 0, limit = -1, appliesTo, searchPattern = null, sortBy = 'created_at', sortOrder = 'ASC') {
        console.log("Fetching all metadata with filters:");
        const whereClause = {};
        const offset = page * limit;
        
        if (!META_DATA.META_DATA_ALLOWED_SORT_FIELDS.includes(sortBy)) {
            sortBy = 'created_at';
        }

        if (!GENERAL.ALLOWED_SORT_ORDER.includes(sortOrder)) {
            sortOrder = 'ASC';
        }

        if (searchPattern) {
            whereClause.name = { [Op.iLike]: `%${searchPattern}%` };
        }

        if (appliesTo) {
            whereClause.applies_to = {
                [Op.or]: [
                    { [Op.contains]: [appliesTo] },
                    { [Op.contains]: ["all"] }
                ]
            };
        }

        const metadataList = await MetaData.findAll({ 
            ...(limit > 0 ? {limit, offset } : {}),
            where: whereClause,
            order: [[sortBy, sortOrder]],
        });
            
        console.log("Metadata retrieved:", metadataList.length);
        return {
            data: metadataList,
            message: MESSAGES.META_DATA.OBTAINED
        };
    }

    static async getMetaDataById(id) {
        console.log("Fetching metadata by ID:", id);
        const metadata = await MetaData.findByPk(id);
        if (!metadata) {
            console.log(`Metadata not found for ID: ${id}`);
            throw new CustomError(
                MESSAGES.META_DATA.NOT_FOUND,
                HttpStatus.NOT_FOUND
            );
        }

        return metadata;
    }

    static async updateMetaData(id, data) {
        if (!id) {
            console.log("[updateMetaData] required ID not found", id);
            throw new CustomError(
                `${MESSAGES.GENERAL.REQUIRED_FIELD_MISSING}: id`,
                HttpStatus.BAD_REQUEST
            );
        }

        const metaData = await MetaData.findByPk(id);
        if (!metaData) {
            console.log("[updateMetaData] Invalid ID, meta data not found");
            throw new CustomError(
                MESSAGES.META_DATA.NOT_FOUND,
                HttpStatus.NOT_FOUND
            );
        }

        console.log("Received request for updating meta data", id, data);

        const requiredFields = ["name", "label", "input_type", "supported_values"];
        for (const field of requiredFields) {
            if (!data[field]) {
                console.log(`Missing required field: ${field}`);
                throw new CustomError(
                    `${MESSAGES.GENERAL.REQUIRED_FIELD_MISSING}: ${field}`,
                    HttpStatus.BAD_REQUEST
                );
            }
        }

        const validInputTypes = ["text", "select", "multiselect", "number"];
        if (!validInputTypes.includes(data.input_type)) {
            console.log(`Invalid input_type: ${data.input_type}`);
            throw new CustomError(
                MESSAGES.META_DATA.INVALID_INPUT_TYPE,
                HttpStatus.BAD_REQUEST
            );
        }

        const validAppliesToField = ["all", "risk_scenario", "process", "threat", "asset", "control"];
        if (!data.applies_to.every(value => validAppliesToField.includes(value))) {
            console.log(`Invalid value for applies_to: ${data.applies_to}`);
            throw new CustomError(
                MESSAGES.META_DATA.INVALID_APPLIES_TO,
                HttpStatus.BAD_REQUEST
            );
        }

        const updated = await metaData.update(data);
        console.log("Meta data updated successfully", updated);
        return {
            data: updated,
            message: MESSAGES.META_DATA.UPDATED
        };
    }

    static async deleteMetadata(id) {
        if (!id) {
            console.log("[deleteMetadata] Required field 'id' not found");
            throw new CustomError(
                `${MESSAGES.GENERAL.REQUIRED_FIELD_MISSING}: id`,
                HttpStatus.BAD_REQUEST
            );
        }

        const metaData = await MetaData.findByPk(id);
        if (!metaData) {
            console.log("[deleteMetadata] Meta data not found for ID:", id);
            throw new CustomError(
                MESSAGES.META_DATA.NOT_FOUND,
                HttpStatus.NOT_FOUND
            );
        }

        await metaData.destroy();
        console.log("Meta data deleted successfully");
        return {
            message: MESSAGES.META_DATA.DELETED
        };
    }
}

module.exports = MetaDataService;