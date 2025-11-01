const express = require("express");
const router = express.Router();
const AssessmentService = require("../services/assessment_service");
const HttpStatus = require("../constants/httpStatusCodes");

// Route: Create a new assessment
router.post("/", async (req, res) => {
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
});

/**
 * Add processes & update status
 */
router.post("/:id/save_processes", async (req, res) => {
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
});

/**
 * @route POST /assessment-process-risk-scenarios
 * @desc Save risk scenarios for an assessment process and update assessment status
 */
router.post("/assessment-process-risk-scenarios", async (req, res) => {
  const { userId } = req.body; // userId comes in body
  const payload = req.body;

  const result = await AssessmentService.addRiskScenariosAndUpdateStatus(
    payload,
    userId
  );

  res.status(HttpStatus.OK).json(result);
});

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
 * @route GET /assessments/by-org-or-bu
 * @desc Get assessments filtered by organization ID or business unit ID
 * @query orgId, businessUnitId
 */
router.get("/by-org-or-bu", async (req, res) => {
  try {
    const { orgId, businessUnitId } = req.query;

    if (!orgId && !businessUnitId) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: "Either orgId or businessUnitId is required",
      });
    }

    const result = await AssessmentService.getAssessmentsByOrgOrBU({
      orgId,
      businessUnitId,
    });

    res.status(HttpStatus.OK).json({
      message: "Assessments fetched successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error fetching assessments by org or BU:", error);
    res.status(error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: error.message || "Failed to fetch assessments",
    });
  }
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
router.post("/assessment-risk-details", async (req, res) => {
  const { userId } = req.body;
  const payload = req.body;

  if (!userId) {
    return res.status(HttpStatus.BAD_REQUEST).json({
      message: "userId is required in the request body",
    });
  }

  const result = await AssessmentService.saveRiskDetails(payload, userId);

  res.status(HttpStatus.OK).json(result);
});

/**
 * @route POST /assessment-process-assets
 * @desc Save assets for an assessment process and update assessment status
 */
router.post("/assessment-process-assets", async (req, res) => {
  const { userId } = req.body; // userId comes in body
  const payload = req.body;

  const result = await AssessmentService.addAssetsAndUpdateStatus(
    payload,
    userId
  );

  res.status(HttpStatus.OK).json(result);
});

/**
 * @route GET /assessments/all/details
 * @desc Get all assessments with full consecutive details
 */
router.get("/all/details", async (req, res) => {
  try {
    const { page, limit, sortBy, sortOrder } = req.query;

    const result = await AssessmentService.getAllAssessmentsWithDetails({
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
      sortBy: sortBy || "createdDate",
      sortOrder: sortOrder || "DESC",
    });

    res.status(HttpStatus.OK).json({
      message: "Assessments with full details fetched successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error fetching assessment details:", error);
    res.status(error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: error.message || "Failed to fetch assessment details",
    });
  }
});

/**
 * @route POST /assessment-questionaire
 * @desc Create or bulk insert Assessment Questionaire entries
 */
router.post("/assessment-questionaire", async (req, res) => {
  try {
    const { assessmentId, userId, questionaires } = req.body;

    if (!userId) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: "userId is required in the request body",
      });
    }

    if (
      !questionaires ||
      !Array.isArray(questionaires) ||
      questionaires.length === 0
    ) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: "At least one questionaire entry is required",
      });
    }

    const result = await AssessmentService.createQuestionaires(
      assessmentId,
      questionaires,
      userId
    );

    res.status(HttpStatus.CREATED).json({
      message: "Assessment Questionaire(s) created successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error creating assessment questionaire:", error);
    res.status(error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: error.message || "Failed to create assessment questionaire",
    });
  }
});

module.exports = router;
