
const { Op } = require("sequelize");
const { MetaData } = require("../../../models");

/**
 * Service class responsible for handling business logic
 * related to metadata management, such as creation, validation,
 * and interaction with the MetaData model.
 */
class MetaDataService {

  /**
   * Creates a new metadata entry after validating the input.
   *
   * @param {Object} data - The metadata payload.
   * @param {string} data.name - Unique identifier for the metadata field.
   * @param  {string} data.label - Human-readable label for display.
   * @param {string} data.input_type - Type of input (e.g., text, number, select).
   * @param {string[]} data.supported_values - Allowed values if input_type is 'select' or 'multiselect'.
   * @param {string[]} data.applies_to - Entities this metadata applies to (e.g., risk_scenario, asset).
   *
   * @throws {Error} If any required field is missing or validation fails.
   *
   * @returns {Promise<Object>} The newly created MetaData record.
   *
   * @example
   * const data = {
   *   name: "severity",
   *   label: "Severity",
   *   input_type: "select",
   *   supported_values: ["Low", "Medium", "High"],
   *   applies_to: ["risk_scenario", "asset"]
   * };
   * const metadata = await MetaDataService.createMetaData(data);
   */
  static async createMetaData(data) {
    // Basic validation
    console.log("Received request for creating meta data", data);

    const requiredFields = ["name", "label", "supported_values"];

    for (const field of requiredFields) {
      if (!data[field]) {
        console.log(`Missing required field: ${field}`);
        throw new Error(`Missing required field: ${field}`);
      }
    }

    // Validate input_type values
    const validInputTypes = ["text", "select", "multiselect", "number"];
    if (!validInputTypes.includes(data.input_type)) {
      console.log(`Invalid input_type: ${data.input_type}`);
      throw new Error(`Invalid input_type: ${data.input_type}`);
    }

    const validAppliesToField = [
      "all",
      "risk_scenario",
      "process",
      "threat",
      "asset",
      "control",
    ];
    if (
      !data.applies_to.every((value) => validAppliesToField.includes(value))
    ) {
      console.log(`Invalid value for applies_to: ${data.applies_to}`);
      throw new Error(`Invalid value for applies_to: ${data.applies_to}`);
    }
    // Create Metadata
    return await MetaData.create(data);
  }

  
  
  /**
   * Retrieves all metadata records, optionally filtered by name and applies_to.
   *
   * @param {Object} [filters={}] - Optional filters for querying metadata.
   * @param {string} [filters.name] - Case-insensitive partial match on the metadata name.
   * @param {string} [filters.applies_to] - Entity type to filter metadata that applies to it
   *                                       (e.g., "risk_scenario", "asset"). Also includes metadata
   *                                       that applies to "all".
   *
   * @returns {Promise<Object[]>} Array of matching MetaData records.
   *
   * @example
   * const allMetadata = await MetaDataService.getAllMetaData();
   * const filtered = await MetaDataService.getAllMetaData({ name: 'severity' });
   * const forAssets = await MetaDataService.getAllMetaData({ applies_to: 'asset' });
   */
  static async getAllMetaData(filters = {}) {
    const whereClause = {};

    // Filter by name (case-insensitive match)
    if (filters.name) {
      whereClause.name = { [Op.iLike]: `%${filters.name}%` };
    }

    if (filters.applies_to) {
      whereClause.applies_to = {
        [Op.or]: [
          { [Op.contains]: [filters.applies_to] },
          { [Op.contains]: ["all"] },
        ],
      };
    }

    return await MetaData.findAll({ where: whereClause });
  }

  
  
  /**
   * Retrieves a metadata record by its primary key (ID).
   *
   * @param {number} id - The ID of the metadata record to retrieve.
   *
   * @throws {Error} If no metadata is found with the given ID.
   *
   * @returns {Promise<Object>} The matching MetaData record.
   *
   * @example
   * const metadata = await MetaDataService.getMetaDataById(1);
   */
  static async getMetaDataById(id) {
    const metadata = await MetaData.findByPk(id);
    if (!metadata) {
      throw new Error("Metadata not found");
    }
    return metadata;
  }


  /**
   * Update Meta Data Record by Replacing the existing record with new one
   * @param {number} id - The id of the meta data to be updated
   * @param {object} data the metadata payload to update
   * @param {string} data.name - name of the metadata
   * @param {string} data.lable 
   * 
   * @throws {Error} If any required field is missing or validation fails.
   *
   * @returns {Promise<Object>} The Updated MetaData record.
   *
   * @example
   * const data = {
   *   name: "severity",
   *   label: "Severity",
   *   input_type: "select",
   *   supported_values: ["Low", "Medium", "High"],
   *   applies_to: ["risk_scenario", "asset"]
   * };
   *
   */
  static async updateMetaData(id, data) {
    if (!id) {
      console.log("[updateMetaData] required ID not found", id);
      throw new Error("[updateMetaData] required ID not found");
    }

    const metaData = await MetaData.findByPk(id);
    if (!metaData) {
      console.log("[updateMeta data] invalid request Id not found");
      throw new Error("Invalid Request"); 
    }

    console.log("Received request for Updating meta data", id, data);

    // Basic validation
    const requiredFields = ["name", "label", "input_type", "supported_values"];

    for (const field of requiredFields) {
      if (!data[field]) {
        console.log(`Missing required field: ${field}`);
        throw new Error(`Missing required field: ${field}`);
      }
    }
    
    const {
      name,
      label,
      input_type,
      supported_values,
      applies_to
    } = data;

    //  Validate input_type values
    const validInputTypes = ["text", "select", "multiselect", "number"];
    if (!validInputTypes.includes(input_type)) {
      console.log(`Invalid input_type: ${input_type}`);
      throw new Error(`Invalid input_type: ${input_type}`);
    }

    const validAppliesToField = [
      "all",
      "risk_scenario",
      "process",
      "threat",
      "asset",
      "control",
    ];
    if (
      !applies_to.every((value) => validAppliesToField.includes(value))
    ) {
      console.log(`Invalid value for applies_to: ${applies_to}`);
      throw new Error(`Invalid value for applies_to: ${applies_to}`);
    }
    //Update Meta Data
    return await metaData.update(
        {
          name,
          label,
          input_type,
          supported_values
        }
    );
  }

  /**
   * Deletes a metadata record by its ID
   *
   * @param {number} id - The ID of the metadata record to delete.
   * @returns {Promise<Object>} A promise that resolves to a message object indicating success.
   * @throws {Error} If the ID is not provided or if no metadata is found with the given ID.
   */

  static async deleteMetadata(id) {
    if (!id) {
      console.log("[deleteMetadata] required filed id not found");
      throw new Error("required filed id not found");
      
    }
    const metaData = await MetaData.findByPk(id);

    if (!metaData) {
      console.log("[deleteMetadata] Invalid ID not Meta Data found");
      throw new Error("Invalid ID not Meta Data found");
    }
    await metaData.destroy();
    return {"message": "Meta data deleted "}
  }
}

module.exports = MetaDataService;
