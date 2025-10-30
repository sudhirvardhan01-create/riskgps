const express = require("express");
const HttpStatusCodes = require("../constants/httpStatusCodes");
const router = express.Router();
const ReportsService = require("../services/reports_service");

router.get("/process-details", async (req, res) => {
    try {
        const organizationName = req.query.organizationName ?? null
        const businessUnit = req.query.businessUnit ?? null
        const data = await ReportsService.getOrganizationalDependencyData(organizationName, businessUnit)
        res.status(HttpStatusCodes.OK).json({
            data: data,
            msg: "fetched dashboard details"
        });
    } catch (err) {
        console.log("Failed to fetch summary", err);
        res.status(HttpStatusCodes.BAD_REQUEST).json({ error: err.message });
    }
})

module.exports = router;