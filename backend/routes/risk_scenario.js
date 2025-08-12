const express = require('express');
const RiskScenarioService = require('../services/risk_scenario');
const Messages = require('../constants/messages');
const HttpStatus = require('../constants/httpStatusCodes');
const router = express.Router();

/**
 * @route POST /risk-scenario
 * @description Create a new risk scenario
 * @param {Object} req.body - Risk scenario data
 * @returns {JSON} 201 - Created risk scenario
 * @returns {JSON} 400 - Bad request or creation failure
 */
router.post('/', async (req, res) => {
    try {
        const result = await RiskScenarioService.createRiskScenario(req.body);
        res.status(HttpStatus.CREATED).json({
            data: result,
            msg: Messages.RISK_SCENARIO.CREATED
        });
    } catch (err) {
        console.log("Failed to create risk scenario", err);
        res.status(HttpStatus.BAD_REQUEST).json({
            error: err.message || Messages.GENERAL.BAD_REQUEST
        });
    }
});

/**
 * @route GET /risk-scenario
 * @description Retrieve all risk scenarios with pagination
 * @param {Number} [req.query.limit=6] - Number of records per page
 * @param {Number} [req.query.page=0] - Page number
 * @returns {JSON} 200 - List of risk scenarios
 * @returns {JSON} 500 - Server error
 */
router.get('/', async (req, res) => {
    try {
        const limit = parseInt(req.query?.limit) || 6;
        const page = parseInt(req.query?.page) || 0;
        const searchPattern = req.query.search || null;
        const sortBy = req.query.sortby || 'created_at';
        const sortOrder = req.query.sortorder || 'ASC';

        const scenarios = await RiskScenarioService.getAllRiskScenarios(page, limit, searchPattern, sortBy, sortOrder);
        res.status(HttpStatus.OK).json({
            data: scenarios,
            msg: Messages.RISK_SCENARIO.FETCHED
        });
    } catch (err) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            error: err.message || Messages.GENERAL.SERVER_ERROR
        });
    }
});

/**
 * @route GET /risk-scenario/:id
 * @description Get a risk scenario by ID
 * @param {String} req.params.id - Risk scenario ID
 * @returns {JSON} 200 - Risk scenario data
 * @returns {JSON} 404 - Scenario not found
 */
router.get('/:id', async (req, res) => {
    try {
        const scenario = await RiskScenarioService.getRiskScenarioById(req.params.id);
        res.status(HttpStatus.OK).json({
            data: scenario,
            msg: Messages.RISK_SCENARIO.FETCHED_BY_ID
        });
    } catch (err) {
        res.status(HttpStatus.NOT_FOUND).json({
            error: err.message || Messages.RISK_SCENARIO.NOT_FOUND(req.params.id)
        });
    }
});

/**
 * @route PUT /risk-scenario/:id
 * @description Update an existing risk scenario by ID
 * @param {String} req.params.id - Risk scenario ID
 * @param {Object} req.body - Updated risk scenario fields
 * @returns {JSON} 200 - Updated scenario
 * @returns {JSON} 404 - Scenario not found or update failed
 */
router.put("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const body = req.body;
        const response = await RiskScenarioService.updateRiskScenario(id, body);
        res.status(HttpStatus.OK).json({
            data: response,
            msg: Messages.RISK_SCENARIO.UPDATED
        });
    } catch (err) {
        console.log("Failed to update the risk scenario", err);
        res.status(HttpStatus.NOT_FOUND).json({
            error: err.message || Messages.RISK_SCENARIO.NOT_FOUND(id)
        });
    }
});

/**
 * @route DELETE /risk-scenario/:id
 * @description Delete a risk scenario by ID
 * @param {String} req.params.id - Risk scenario ID
 * @returns {JSON} 200 - Deletion success message
 * @returns {JSON} 404 - Scenario not found or deletion failed
 */
router.delete("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        await RiskScenarioService.deleteRiskScenarioById(id);
        res.status(HttpStatus.OK).json({
            msg: Messages.RISK_SCENARIO.DELETED
        });
    } catch (err) {
        console.log("Delete risk scenario failed", err);
        res.status(HttpStatus.NOT_FOUND).json({
            error: err.message || Messages.RISK_SCENARIO.NOT_FOUND(req.params.id)
        });
    }
});

/**
 * @route PATCH /risk-scenario/update-status/:id
 * @description Update the status of a risk scenario
 * @param {String} req.params.id - Risk scenario ID
 * @param {String} req.body.status - New status value
 * @returns {JSON} 200 - Status update success message
 * @returns {JSON} 404 - Scenario not found or update failed
 */
router.patch("/update-status/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const status = req.body.status;
        await RiskScenarioService.updateRiskScenarioStatus(id, status);
        res.status(HttpStatus.OK).json({
            msg: Messages.RISK_SCENARIO.STATUS_UPDATED
        });
    } catch (err) {
        console.log("Update risk scenario status failed", err);
        res.status(HttpStatus.NOT_FOUND).json({
            error: err.message || Messages.RISK_SCENARIO.NOT_FOUND(id)
        });
    }
});

module.exports = router;
