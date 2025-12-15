const express = require("express");
const SyncupService = require("../services/syncup_service");
const HttpStatusCodes = require("../constants/httpStatusCodes");
const router = express.Router();

router.get("/v1/data-syncup/:orgId", async (req, res) => {
  try {
    const { orgId } = req.params;
    if (!orgId) {
      throw new Error("Org ID required");
    }
    const businessUnitId = req.query.businessUnitId ?? null;
    if (!orgId) {
      throw new Error("Org id not found");
    }
    const data = await SyncupService.assessmentSyncUpJob(orgId);
    res.status(HttpStatusCodes.OK).json({
      data: data,
      msg: "fetched reports details",
    });
  } catch (err) {
    console.log("Failed to fetch summary", err);
    res.status(HttpStatusCodes.BAD_REQUEST).json({ error: err.message });
  }
});

router.get("/v1/last-syncup-details/:orgId", async (req, res) => {
  try {
    const { orgId } = req.params;
    if (!orgId) {
      throw new Error("Org ID required");
    }
    const data = await SyncupService.getLastSyncupDetails(orgId);
    console.log(data);

    res.status(HttpStatusCodes.OK).json({
      data: data,
      msg: "fetched last syncup details",
    });
  } catch (err) {
    console.log("Failed to get last syncup details", err);
    res.status(HttpStatusCodes.BAD_REQUEST).json({ error: err.message });
  }
});

router.get("/export-reports-data/:orgId", async (req, res) => {
  try {
    const { orgId } = req.params;
    if (!orgId) {
      throw new Error("Org ID required");
    }
    await SyncupService.downloadOrganizationLatestReportsDataExcel(orgId, res)
  } catch (err) {
    console.log("Failed to download reports data", err);
    res.status(HttpStatusCodes.BAD_REQUEST).json({ error: err.message });
  }
});

module.exports = router;
