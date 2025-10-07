const express = require("express");
const router = express.Router();
const AssessmentService = require("../services/assessment_service");
const HttpStatus = require("../constants/httpStatusCodes");

// Route: Create a new assessment
router.post(
    "/",
    async (req, res) => {
        const assessmentData = req.body;

        if (!assessmentData.userId) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                message: "userId is required in the request body",
            });
        }

        const assessment = await AssessmentService.createAssessment(
            assessmentData,
            assessmentData.userId
        );

        res.status(HttpStatus.CREATED).json({
            message: "Assessment created successfully",
            data: assessment,
        });
    }
);

/**
 * Add processes & update status
 */
router.post(
    "/:id/save_processes",
    async (req, res) => {
        const { id } = req.params;
        const { processes, status, userId } = req.body;

        if (!userId) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                message: "userId is required in the request body",
            });
        }

        const result = await AssessmentService.addProcessesAndUpdateStatus(
            id,
            processes,
            status,
            userId
        );

        res.status(HttpStatus.OK).json(result);
    }
);

/**
 * @route POST /assessment-process-risk-scenarios
 * @desc Save risk scenarios for an assessment process and update assessment status
 */
router.post(
    "/assessment-process-risk-scenarios",
    async (req, res) => {
        const { userId } = req.body; // userId comes in body
        const payload = req.body;

        const result =
            await AssessmentService.addRiskScenariosAndUpdateStatus(
                payload,
                userId
            );

        res.status(HttpStatus.OK).json(result);
    }
);

/**
 * @route GET /assessments
 * @desc Get all assessments with pagination, search & sorting
 */
router.get("/", async (req, res) => {
    const { page, limit, search, sortBy, sortOrder } = req.query;

    const result = await AssessmentService.getAllAssessments(
        parseInt(page) || 1,
        parseInt(limit) || 10
    );

    res.status(HttpStatus.OK).json(result);
});

/**
 * @route GET /assessments/:id
 * @desc Get assessment by ID
 */
router.get("/:id", async (req, res) => {
    const { id } = req.params;

    const result = await AssessmentService.getAssessmentById(id);

    res.status(HttpStatus.OK).json({
        message: "Assessment fetched successfully",
        data: result,
    });
});

/**
 * @route POST /assessment-risk-details
 * @desc Save business impacts & taxonomies for an assessment process risk
 */
router.post(
    "/assessment-risk-details",
    async (req, res) => {
        const { userId } = req.body;
        const payload = req.body;

        if (!userId) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                message: "userId is required in the request body",
            });
        }

        const result = await AssessmentService.saveRiskDetails(payload, userId);

        res.status(HttpStatus.OK).json(result);
    }
);



module.exports = router;
