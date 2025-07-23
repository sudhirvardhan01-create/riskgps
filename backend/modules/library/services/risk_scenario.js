const {
  RiskScenario,
  RiskScenarioAttribute,
  MetaData,
  sequelize,
} = require("../models");

/**
 * services for routes /risk-scenario
 * Risk scenario service contains the function for operation the risk scenario model
 * 
 */
class RiskScenarioService {

  /**
   * create the Riskscenario
   * @param {JSON} data 
   * @returns 
   */
  static async createRiskScenario(data) {
    const {
      risk_scenario,
      risk_description,
      risk_statement,
      status,
      attributes,
    } = data;
    return await sequelize.transaction(async (t) => {
      if (!risk_scenario) {
        console.log("risk_scenario is required.");
        throw new Error("risk_scenario is required.");
      }

      const statusSupportedValues = ["draft", "published", "not_published"];
      if (status && !statusSupportedValues.includes(status)) {
        console.log("Invalid Value for Status");
        throw new Error("Invalid Value for Status");
      }
      const scenario = await RiskScenario.create(
        {
          risk_scenario,
          risk_description,
          risk_statement,
          status,
        },
        { transaction: t }
      );

      if (Array.isArray(attributes)) {
        for (const attr of attributes) {
          if (!attr.meta_data_key_id || !attr.values) {
            throw new Error(
              "Each attribute must have meta_data_key_id and values."
            );
          }

          const metaData = await MetaData.findByPk(attr.meta_data_key_id, {
            transaction: t,
          });
          if (!metaData) {
            throw new Error(
              `MetaData not found for ID: ${attr.meta_data_key_id}`
            );
          }

          const supportedValues = metaData.supported_values;
          if (
            supportedValues?.length > 0 &&
            !attr.values.every((value) => supportedValues.includes(value))
          ) {
            throw new Error(
              `Invalid Value For Meta Data: ${attr.meta_data_key_id}`
            );
          }

          await RiskScenarioAttribute.create(
            {
              risk_scenario_id: scenario.id,
              meta_data_key_id: attr.meta_data_key_id,
              values: attr.values,
            },
            { transaction: t }
          );
        }
      }

      return scenario;
    });
  }

  /**
   * Get All Risk Scenarios
   * @returns {Promise<Object>} A promise that resolves to a success message or updated data.
   * @throws {Error} If the update fails or validation errors occur.
   */
  static async getAllRiskScenarios() {
    return await RiskScenario.findAll({
      include: [
        {
          model: RiskScenarioAttribute,
          as: "attributes",
          include: [
            {
              model: MetaData,
              as: "metaData",
            },
          ],
        },
      ],
    });
  }

  /**
   * Get Risk Scenario By ID
   * @param {integer} id 
   * @returns {Promise<Object>} A promise that resolves to a success message or updated data.
   * @throws {Error} If the update fails or validation errors occur.
   */
  static async getRiskScenarioById(id) {
    const scenario = await RiskScenario.findByPk(id, {
      include: [
        {
          model: RiskScenarioAttribute,
          as: "attributes",
          include: [
            {
              model: MetaData,
              as: "metaData",
            },
          ],
        },
      ],
    });

    if (!scenario) {
      throw new Error("Risk Scenario not found.");
    }

    return scenario;
  }

  /**
   * 
   * @typedef {Object} Attribute
   * @property {number} meta_data_key - The key representing the metadata field.
   * @property {string} value - The value of the attribute.
   *   
   * service to update risk Scenario
   * performs a replace of the current existing record for the risk scenario with the new data object
   * if the update success
   * @param {int} id 
   * @param {JSON} data 
   * @param {string} data.risk_scenario the risk scenario title/ name
   * @param {string} data.risk_description 
   * @param {string} data.risk_statement
   * @param {string} data.status
   * @param {Attribute []} data.attribute
   * @returns {Promise<Object>} A promise that resolves to a success message or updated data.
   * @throws {Error} If the update fails or validation errors occur.
   */
  static async updateRiskScenario(id, data) {
    const {
      risk_scenario,
      risk_description,
      risk_statement,
      status,
      attributes,
    } = data;

    return await sequelize.transaction(async (t) => {
      const scenario = await RiskScenario.findByPk(id, { transaction: t });

      if (!scenario) {
        throw new Error(`RiskScenario not found for ID: ${id}`);
      }

      if (risk_scenario === undefined) {
        throw new Error("risk_scenario is required.");
      }

      const statusSupportedValues = ["draft", "published", "not_published"];
      if (status && !statusSupportedValues.includes(status)) {
        throw new Error("Invalid Value for Status");
      }

      // Update the scenario
      await scenario.update(
        {
          risk_scenario,
          risk_description,
          risk_statement,
          status,
        },
        { transaction: t }
      );

      // Update attributes with the new attributes
      if (Array.isArray(attributes)) {
        // Delete existing attributes
        await RiskScenarioAttribute.destroy({
          where: { risk_scenario_id: id },
          transaction: t,
        });

        for (const attr of attributes) {
          if (!attr.meta_data_key_id || !attr.values) {
            throw new Error(
              "Each attribute must have meta_data_key_id and values."
            );
          }

          const metaData = await MetaData.findByPk(attr.meta_data_key_id, {
            transaction: t,
          });

          if (!metaData) {
            throw new Error(
              `MetaData not found for ID: ${attr.meta_data_key_id}`
            );
          }

          const supportedValues = metaData.supported_values;

          if (
            supportedValues?.length > 0 &&
            !attr.values.every((value) => supportedValues.includes(value))
          ) {
            throw new Error(
              `Invalid Value For Meta Data: ${attr.meta_data_key_id}`
            );
          }

          await RiskScenarioAttribute.create(
            {
              risk_scenario_id: id,
              meta_data_key_id: attr.meta_data_key_id,
              values: attr.values,
            },
            { transaction: t }
          );
        }
      }

      return scenario;
    });
  }

  /**
   * route delete: /risk-scenario
   * Delete Risk Scenario by its ID
   * @param {integer} id 
   * @returns 
   */
  static async deleteRiskScenarioById(id) {
    const riskScenario = await RiskScenario.findByPk(id);

    if (!riskScenario) {
      console.log("[deleteRiskScenario] no Risk Scenario Found by Id ", id);
      throw new Error(`Invalid Risk Scenario ID ${id}`);
    }
    await riskScenario.destroy();
    return { message: "Risk Scenario deleted successfully." };
  }
}

module.exports = RiskScenarioService;
