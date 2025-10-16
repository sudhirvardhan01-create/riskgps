const express = require("express");
const router = express.Router();
const Messages = require("../constants/messages");
const HttpStatus = require("../constants/httpStatusCodes");
const CustomError = require("../utils/CustomError");
const QuestionnaireService = require("../services/questionnaire");

router.post("/", async (req, res) => {
  try {
    const question = await QuestionnaireService.createQuestionnaire(req.body);
    res.status(HttpStatus.CREATED).json({
      data: question,
      message: "Question created successfully",
    });
  } catch (err) {
    res.status(HttpStatus.BAD_REQUEST).json({
      error: err.message || Messages.GENERAL.BAD_REQUEST,
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const assetCategory = req.query.assetCategory || "Windows";
    const searchPattern = req.query.search || null;
    const limit = parseInt(req.query?.limit) || 6;
    const page = parseInt(req.query?.page) || 0;
    const sortBy = req.query.sort_by || "createdDate";
    const sortOrder = req.query.sort_order?.toUpperCase() || "ASC";
    const statusFilter = req.query.status ? req.query.status?.split(",") : [];
    const questionnaires = await QuestionnaireService.getAllQuestionnaire(
      assetCategory,
      page,
      limit,
      searchPattern,
      sortBy,
      sortOrder,
      statusFilter
    );
    res.status(HttpStatus.OK).json({
      result: questionnaires,
      msg: "Records Fetched",
    });
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      error: err.message || Messages.GENERAL.SERVER_ERROR,
    });
  }
});

router.get("/download-template-file", async (req, res) => {
  try {
    await QuestionnaireService.downloadQuestionnaireTemplateFile(res);
  } catch (err) {
    res.status(HttpStatus.NOT_FOUND).json({
      error: err.message || "Failed to download Qustionnaire Template file",
    });
  }
});

router.get("/export", async (req, res) => {
  try {
    await QuestionnaireService.exportQuestionnaireCSV(res);
  } catch (err) {
    res.status(HttpStatus.NOT_FOUND).json({
      error: err.message || "Failed to export Questions File",
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const body = req.body;
    const response = await QuestionnaireService.updateQuestionnaire(id, body);
    res.status(HttpStatus.OK).json({
      data: response,
      message: "Question updated successfully",
    });
  } catch (err) {
    res.status(HttpStatus.NOT_FOUND).json({
      error: err.message,
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const assetCategory = req.body.assetCategory;
    const response = await QuestionnaireService.deleteQuestionnaire(
      id,
      assetCategory
    );
    res.status(HttpStatus.OK).json({
      data: response,
    });
  } catch (err) {
    res.status(HttpStatus.NOT_FOUND).json({
      error: err.message,
    });
  }
});

router.patch("/update-status/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const status = req.body.status;
    await QuestionnaireService.updateQuestionnaireStatus(id, status);
    res.status(HttpStatus.OK).json({
      message: "Status of question updated successfully",
    });
  } catch (err) {
    res.status(HttpStatus.NOT_FOUND).json({
      error: err.message,
    });
  }
});

module.exports = router;
