const express = require("express");
const router = express.Router();
const Messages = require("../constants/messages");
const HttpStatus = require("../constants/httpStatusCodes");
const OrganizationService = require("../services/organization_service");

/**
 * @route GET /organization
 * @description Get all organizations with optional filtering + pagination
 */
router.get("/", async (req, res) => {
    try {
        const searchPattern = req.query.search || null;
        const limit = parseInt(req.query?.limit) || 10;
        const page = parseInt(req.query?.page) || 0;
        const sortBy = req.query.sort_by || "created_date";
        const sortOrder = req.query.sort_order?.toUpperCase() || "DESC";

        const organizations = await OrganizationService.getAllOrganizations(
            page,
            limit,
            searchPattern,
            sortBy,
            sortOrder
        );

        res.status(HttpStatus.OK).json({
            data: organizations,
            msg: Messages.ORGANIZATION.FETCHED,
        });
    } catch (err) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            error: err.message || Messages.GENERAL.SERVER_ERROR,
        });
    }
});

/**
 * @route GET /organization/:id
 * @description Get organization by ID (with business units)
 */
router.get("/:id", async (req, res) => {
    try {
        const organization = await OrganizationService.getOrganizationById(req.params.id);
        res.status(HttpStatus.OK).json({
            data: organization,
            msg: Messages.ORGANIZATION.FETCHED_BY_ID,
        });
    } catch (err) {
        res.status(err.statusCode || HttpStatus.NOT_FOUND).json({
            error: err.message || Messages.ORGANIZATION.NOT_FOUND,
        });
    }
});

/**
 * @route GET /organization/:orgId/business-unit/:businessUnitId/processes
 * @description Get all processes for a given organization + business unit (both mandatory)
 */
router.get("/:orgId/business-unit/:businessUnitId/processes", async (req, res) => {
    try {
        const { orgId, businessUnitId } = req.params;

        const processes = await OrganizationService.getOrganizationProcesses(orgId, businessUnitId);

        res.status(HttpStatus.OK).json({
            data: processes,
            msg: Messages.ORGANIZATION.PROCESSES_FETCHED,
        });
    } catch (err) {
        res.status(err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR).json({
            error: err.message || Messages.GENERAL.SERVER_ERROR,
        });
    }
});

/**
 * @route GET /organization/:orgId/risk-scenarios
 * @desc Get all risk scenarios for an organization
 */
router.get("/:orgId/risk-scenarios", async (req, res) => {
    try {
        const { orgId } = req.params;

        if (!orgId) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                message: "Organization ID is required in the URL",
            });
        }

        const scenarios = await OrganizationRiskScenarioService.getRiskScenariosByOrgId(orgId);

        res.status(HttpStatus.OK).json({
            message: "Organization risk scenarios fetched successfully",
            data: scenarios,
        });
    } catch (err) {
        res.status(err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR).json({
            error: err.message || "Failed to fetch organization risk scenarios",
        });
    }
});

module.exports = router;
