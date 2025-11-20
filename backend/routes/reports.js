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


router.get("/reports-v1/:orgId", async (req, res) => {
  try {
    const { orgId } = req.params;
    const businessUnitId = req.query.businessUnitId ?? null;
    if (!orgId) {
        throw new Error("Org id not found")
    }
    const data = await generateFlatAssessmentMatrix(
      "bc1b9a89-64f8-469f-bc02-b3417a06c6a4"
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


router.post("/reports-syncup-master/:orgId", async (req, res) => {
  try {
    
    const { orgId } = req.params;  // bc1b9a89-64f8-469f-bc02-b3417a06c6a4"
    const flatten = req.query.flatten?.toLowerCase() === "false" ? false : true;
    const clearOldRecords = req.query.clearOldRecords?.toLowerCase() === "true" ? true : false;
    const updateReportRecords = req.query.updateReportRecords?.toLowerCase() === "true" ? true : false;
    const assessmentIds  = req.body?.assessmentIds ?? [];


    if (!orgId) {
        throw new Error("Org id not found")
    }

    const data = await ReportsService.syncupReportsMasterTable(
      orgId,
      assessmentIds,
      false,
      flatten,
      updateReportRecords,
      clearOldRecords
    );

    res.status(HttpStatusCodes.OK).json({
      data: data,
      msg: "fetched master reports details",
    });
  } catch (err) {
    console.log("Failed to fetch summary", err);
    res.status(HttpStatusCodes.BAD_REQUEST).json({ error: err.message });
  }
});

router.get("/reports-syncup-active/:orgId", async (req, res) => {
  try {
    const { orgId } = req.params;
    const businessUnitId = req.query.businessUnitId ?? null;
    if (!orgId) {
        throw new Error("Org id not found")
    }
    const data = await ReportsService.syncupReportsMasterTable(
      "bc1b9a89-64f8-469f-bc02-b3417a06c6a4",
      false
    );
    res.status(HttpStatusCodes.OK).json({
      data: data,
      msg: "fetched active reports details",
    });
  } catch (err) {
    console.log("Failed to fetch summary", err);
    res.status(HttpStatusCodes.BAD_REQUEST).json({ error: err.message });
  }
});

module.exports = router;
