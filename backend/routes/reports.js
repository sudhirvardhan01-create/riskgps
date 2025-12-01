const express = require("express");
const HttpStatusCodes = require("../constants/httpStatusCodes");
const router = express.Router();
const ReportsService = require("../services/reports_service");
const { generateFlatAssessmentMatrix } = require("../services/reports_helper");

router.get("/process-details/:orgId", async (req, res) => {
  try {
    const { orgId } = req.params;
    const businessUnitId = req.query.businessUnitId ?? null;
    if (!orgId) {
        throw new Error("Org id not found")
    }
    const data = await ReportsService.getOrganizationalDependencyData(
      orgId,
      businessUnitId
    );
    res.status(HttpStatusCodes.OK).json({
      data: data,
      msg: "fetched dashboard details",
    });
  } catch (err) {
    console.log("Failed to fetch summary", err);
    res.status(HttpStatusCodes.BAD_REQUEST).json({ error: err.message });
  }
});


router.get("/reports-v1/:orgId/risk-exposure", async (req, res) => {
  try {
    const { orgId } = req.params;
    if (!orgId) {
      throw new Error("Org ID required");
    }
    const businessUnitId = req.query.businessUnitId ?? null;
    const businessProcessId = req.query.businessProcessId ?? null;
    const riskScenarioId = req.query.riskScenarioId ?? null;
    const assetId = req.query.assetId ?? null;
    if (!orgId) {
        throw new Error("Org id not found")
    }
    const data = await ReportsService.getRiskExposureReportData(
      orgId
    );
    res.status(HttpStatusCodes.OK).json({
      data: data,
      msg: "fetched reports details",
    });
  } catch (err) {
    console.log("Failed to fetch summary", err);
    res.status(HttpStatusCodes.BAD_REQUEST).json({ error: err.message });
  }
});

router.get("/reports-v1/:orgId", async (req, res) => {
  try {
    const { orgId } = req.params;
    if (!orgId) {
      throw new Error("Org ID required");
    }
    const businessUnitId = req.query.businessUnitId ?? null;
    if (!orgId) {
        throw new Error("Org id not found")
    }
    const data = await generateFlatAssessmentMatrix(
      orgId
    );
    res.status(HttpStatusCodes.OK).json({
      data: data,
      msg: "fetched reports details",
    });
  } catch (err) {
    console.log("Failed to fetch summary", err);
    res.status(HttpStatusCodes.BAD_REQUEST).json({ error: err.message });
  }
});



module.exports = router;
