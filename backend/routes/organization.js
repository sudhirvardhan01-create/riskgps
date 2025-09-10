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

module.exports = router;
