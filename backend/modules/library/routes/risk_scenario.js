const express = require('express');
const RiskScenarioService = require('../services/risk_scenario');
const router = express.Router();
const Messages = require("../../../constants/messages");
const HttpStatus = require('../../../constants/httpStatusCodes');

// Create Risk Scenario
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

// Get All Risk Scenarios
router.get('/', async (req, res) => {
    try {
        const limit = parseInt(req.query?.limit) || 6;
        const page = parseInt(req.query?.page) || 0;
        const scenarios = await RiskScenarioService.getAllRiskScenarios(page, limit);
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

// Get Risk Scenario by ID
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

// Update Risk Scenario
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

// Delete Risk Scenario
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

// Update Risk Scenario Status
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