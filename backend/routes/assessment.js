// routes/assessmentRoutes.js
const express = require("express");
const router = express.Router();
const Messages = require("../constants/messages");
const HttpStatus = require("../constants/httpStatusCodes");
const AssessmentService = require("../services/assessmentService");
const multer = require("multer");

/**
 * @route POST /assessment
 * @description Create a new Assessment
 */
router.post("/", async (req, res) => {
    console.log("Request received for assessment creation", req.body);
    try {
        const assessment = await AssessmentService.createAssessment(req.body);
        res.status(HttpStatus.CREATED).json({
            data: assessment,
            msg: Messages.ASSESSMENT.CREATED,
        });
    } catch (err) {
        res.status(HttpStatus.BAD_REQUEST).json({
            error: err.message || Messages.GENERAL.BAD_REQUEST,
        });
    }
});

/**
 * @route GET /assessment
 * @description Get all assessments with optional filtering + pagination
 */
router.get("/", async (req, res) => {
    try {
        const searchPattern = req.query.search || null;
        const limit = parseInt(req.query?.limit) || 6;
        const page = parseInt(req.query?.page) || 0;
        const sortBy = req.query.sort_by || "created_at";
        const sortOrder = req.query.sort_order?.toUpperCase() || "DESC";
        const statusFilter = req.query.status ? req.query.status?.split(",") : [];
        const attrFilters = (req.query.attributes || "")
            .split(";")
            .map((expr) => {
                if (!expr) return null;
                const [metaDataKeyId, values] = expr.split(":");
                return { metaDataKeyId, values: values.split(",") };
            })
            .filter(Boolean);

        const assessments = await AssessmentService.getAllAssessments(
            page,
            limit,
            searchPattern,
            sortBy,
            sortOrder,
            statusFilter,
            attrFilters
        );

        res.status(HttpStatus.OK).json({
            data: assessments,
            msg: Messages.ASSESSMENT.FETCHED,
        });
    } catch (err) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            error: err.message || Messages.GENERAL.SERVER_ERROR,
        });
    }
});

/**
 * @route GET /assessment/:id
 */
router.get("/:id", async (req, res) => {
    try {
        const assessment = await AssessmentService.getAssessmentById(req.params.id);
        res.status(HttpStatus.OK).json({
            data: assessment,
            msg: Messages.ASSESSMENT.FETCHED_BY_ID,
        });
    } catch (err) {
        res.status(HttpStatus.NOT_FOUND).json({
            error: err.message || Messages.ASSESSMENT.NOT_FOUND,
        });
    }
});

/**
 * @route PUT /assessment/:id
 */
router.put("/:id", async (req, res) => {
    try {
        const assessment = await AssessmentService.updateAssessment(req.params.id, req.body);
        res.status(HttpStatus.OK).json({
            data: assessment,
            msg: Messages.ASSESSMENT.UPDATED,
        });
    } catch (err) {
        res.status(HttpStatus.NOT_FOUND).json({
            error: err.message || Messages.ASSESSMENT.NOT_FOUND,
        });
    }
});

/**
 * @route DELETE /assessment/:id
 */
router.delete("/:id", async (req, res) => {
    try {
        await AssessmentService.deleteAssessmentById(req.params.id);
        res.status(HttpStatus.OK).json({
            msg: Messages.ASSESSMENT.DELETED,
        });
    } catch (err) {
        res.status(HttpStatus.NOT_FOUND).json({
            error: err.message || Messages.ASSESSMENT.NOT_FOUND,
        });
    }
});

module.exports = router;
