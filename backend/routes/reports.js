const express = require("express");
const HttpStatusCodes = require("../constants/httpStatusCodes");
const router = express.Router();
const ReportsService = require("../services/reports_service");

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

module.exports = router;
