const express = require('express');
const RiskScenarioService = require('../services/risk_scenario');
const router = express.Router();



/**
 * @route POST /api/risk-scenario
 * @description Create a new Risk Scenario Entry.
 * 
 * @body {string} risk_scenario - The name of the risk scenario.
 * @body {string} risk_description - The Description of the risk
 * @body {string} risk_statement - the risk statement.
 * @body {string} status - the status of the risk Scenario from the enum['draft', 'published', 'not_published']
 * @body {array} attributes - an array of JSON in the form with meta_key_id and value
 * 
 * @returns {201 Created} The newly created metadata object.
 * @returns {400 Bad Request} If validation fails or required fields are missing.
 * 
 * @example
 * POST /api/risk-scenario
 * {
 *   "risk_scenario": "Risk 1",
 *   "risk_descriptio": "Risk DESC",
 *   "risk_statement": "statement",
 *   "status": "draft",
 *   "attributes": []
 * }
 */
router.post('/', async (req, res) => {
  try {
    const result = await RiskScenarioService.createRiskScenario(req.body);
    res.status(201).json({
      data: result,
      msg: "risk scneario created successfully"
    });
  } catch (err) {
    console.log("failed to create risk scenario", err);
    res.status(400).json({ error: err.message });
  }
});

/**
 * @route api/risk-scenario
 * @description Retrieve all the Risk Scenarios entries
 * 
 * @returns {Object[]} 200 - Array of metadata records.
 * @returns {Object} 500 - Internal server error.
 * 
 * @example
 * GET /api/risk-scenario
 */
router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query?.limit) || 6;
    const page = parseInt(req.query?.page) || 0;
    const scenarios = await RiskScenarioService.getAllRiskScenarios(page, limit);
    res.json({
      data: scenarios,
      msg: "risk scenario fetched successfully"
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



/**
 * @route get api/risk-scenario/:id
 * @description Retrieve a single Risk Scenario By ID
 * @param {String} id - the unique Id for the risk Scenario
 * @returns {Object} 200 - Risk Scneario Object if found.
 * @returns {Object} 404 - Returns error if Risk Scenario is Not Found
 * 
 * @example
 * GET /api/risk-scenario/1
 */
router.get('/:id', async (req, res) => {
  try {
    const scenario = await RiskScenarioService.getRiskScenarioById(req.params.id);
    res.json({
      data: scenario,
      msg: "risk scenario fetched successfully by ID"
    });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

/**
 * @route /PUT /api/risk-scenario/:id
 * @description Replace and update the existing content of the risk Scenario Records by ID
 * @body {string} risk_scenario - The name of the risk scenario.
 * @body {string} risk_description - The Description of the risk
 * @body {string} risk_statement - the risk statement.
 * @body {string} status - the status of the risk Scenario from the enum['draft', 'published', 'not_published']
 * @body {array} attributes - an array of JSON in the form with meta_key_id and value
 * 
 * @returns {201 Created} The newly created metadata object.
 * @returns {400 Bad Request} If validation fails or required fields are missing.
 * 
 * @example
 * PUT /api/risk-scenario/:id
 * {
 *   "risk_scenario": "Risk 1",
 *   "risk_descriptio": "Risk DESC",
 *   "risk_statement": "statement",
 *   "status": "draft",
 *   "attributes": []
 * }
 */
router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const body = req.body;
    const response = await RiskScenarioService.updateRiskScenario(id, body);
    res.status(200).json({
      data: response,
      msg: "risk scneario updated successfully"
    });
  } catch (err) {
    console.log("Failed to update the risks scenario", err);
    res.status()
  }
})


/**
 * @route /api/risk-scenario/:id
 * @param {string} id - The unique identifier for the risk Scneario
 * @returns {object} 200 - Sucess message once deleted
 * @returns {object} 400 - Returns  Error message if the risk scenario by id is not found
 * 
 * @example
 * DELETE /api/risk-scenario/1
 */
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const response = await RiskScenarioService.deleteRiskScenarioById(id);
    res.status(200).json({
      msg: "risk scenario deleted successfully"
    });
  } catch (err) {
    console.log("delete risk scenario failed", err);
    res.status(404).json({error: err.message});
  }
})

router.patch("/update-status/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const status = req.body.status;
    const resposnse = await RiskScenarioService.updateRiskScenarioStatus(id, status);
    res.status(200).json({
      msg: "risk scenario status updated successfully"
    });
  } catch (err) {
    console.log("update risk scenario status failed", err);
    res.status(404).json({error: err.message});
  }
})

module.exports = router;
