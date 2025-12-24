const express = require("express");
const HttpStatusCodes = require("../constants/httpStatusCodes");
const router = express.Router();
const ReportsService = require("../services/reports_service");
const ReportsHelper = require("../services/syncup_service");

router.get("/process-details/:orgId", async (req, res) => {
  try {
    const { orgId } = req.params;
    const businessUnitId = req.query.businessUnitId ?? null;
    if (!orgId) {
      throw new Error("Org id not found");
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

router.get("/:orgId/process-risk-exposure", async (req, res) => {
  try {
    const { orgId } = req.params;
    if (!orgId) {
      throw new Error("Org ID required");
    }
    const businessUnitId = req.query.businessUnitId ?? null;
    const businessProcessId = req.query.businessProcessId ?? null;
    const riskScenarioId = req.query.riskScenarioId ?? null;
    const assetId = req.query.assetId ?? null;

    const data = await ReportsService.processesRiskExposureChartData(orgId);
    res.status(HttpStatusCodes.OK).json({
      data: data,
      msg: "fetched reports details",
    });
  } catch (err) {
    console.log("Failed to fetch summary", err);
    res.status(HttpStatusCodes.BAD_REQUEST).json({ error: err.message });
  }
});

router.get("/:orgId/bu-heatmap", async (req, res) => {
  try {
    const { orgId } = req.params;
    if (!orgId) {
      throw new Error("Org ID required");
    }
    const businessUnitId = req.query.businessUnitId ?? null;
    const businessProcessId = req.query.businessProcessId ?? null;
    const riskScenarioId = req.query.riskScenarioId ?? null;
    const assetId = req.query.assetId ?? null;

    const data = await ReportsService.businessUnitHeatmapChart(orgId);
    res.status(HttpStatusCodes.OK).json({
      data: data,
      msg: "fetched reports details",
    });
  } catch (err) {
    console.log("Failed to fetch summary", err);
    res.status(HttpStatusCodes.BAD_REQUEST).json({ error: err.message });
  }
});

router.get("/:orgId/risk-scenario-table-chart", async (req, res) => {
  try {
    const { orgId } = req.params;
    if (!orgId) {
      throw new Error("Org ID required");
    }

    const data = await ReportsService.riskScenarioTableData(orgId);
    res.status(HttpStatusCodes.OK).json({
      data: data,
      msg: "fetched reports details",
    });
  } catch (err) {
    console.log("Failed to fetch summary", err);
    res.status(HttpStatusCodes.BAD_REQUEST).json({ error: err.message });
  }
});

router.get("/:orgId/business-unit-radar-chart", async (req, res) => {
  try {
    const { orgId } = req.params;
    if (!orgId) {
      throw new Error("Org ID required");
    }
    const businessUnitId = req.query.businessUnitId ?? null;
    const data = await ReportsService.businessUnitRadarChart(
      orgId,
      businessUnitId
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

router.get("/:orgId/reports-table-data", async (req, res) => {
  try {
    const { orgId } = req.params;
    if (!orgId) {
      throw new Error("Org ID required");
    }
    const businessUnitId = req.query.businessUnitId ?? null;
    const data = await ReportsService.reportsTableData(orgId);
    res.status(HttpStatusCodes.OK).json({
      data: data,
      msg: "fetched reports details",
    });
  } catch (err) {
    console.log("Failed to fetch summary", err);
    res.status(HttpStatusCodes.BAD_REQUEST).json({ error: err.message });
  }
});

router.get("/:orgId/org-nist-score", async (req, res) => {
  try {
    const { orgId } = req.params;
    if (!orgId) {
      throw new Error("Org ID required");
    }
    const data = await ReportsService.fetchOrganizationNistControlScores(orgId);
    res.status(HttpStatusCodes.OK).json({
      data: data,
      msg: "fetched organization nist score details",
    });
  } catch (err) {
    console.log("Failed to fetch oranization nist scores", err);
    res.status(HttpStatusCodes.BAD_REQUEST).json({ error: err.message });
  }
});

router.patch("/:orgId/org-nist-score", async (req, res) => {
  try {
    const { orgId } = req.params;
    const body = req.body;
    if (!orgId) {
      throw new Error("Org ID required");
    }
    const data = await ReportsService.updateOrganizationNistControlScores(
      orgId,
      body
    );
    res.status(HttpStatusCodes.OK).json({
      data: data,
      msg: "updated organization nist score details",
    });
  } catch (err) {
    console.log("Failed to update oranization nist scores", err);
    res.status(HttpStatusCodes.BAD_REQUEST).json({ error: err.message });
  }
});

router.get("/:orgId/org-asset-mitre-nist-score", async (req, res) => {
  try {
    const { orgId } = req.params;
    if (!orgId) {
      throw new Error("Org ID required");
    }
    const data = await ReportsService.organizationMitreToNistScoreMapping(
      orgId
    );
    res.status(HttpStatusCodes.OK).json({
      data: data,
      msg: "fetched organization mitre to nist score details",
    });
  } catch (err) {
    console.log("Failed to fetch organization mitre to nist scores", err);
    res.status(HttpStatusCodes.BAD_REQUEST).json({ error: err.message });
  }
});

router.get("/:orgId/org-top-assets", async (req, res) => {
  try {
    const { orgId } = req.params;
    if (!orgId) {
      throw new Error("Org ID required");
    }
    const requiredCount = req.query.requiredCount ?? 5;
    const data = await ReportsService.topNRiskyAssets(orgId, requiredCount);
    res.status(HttpStatusCodes.OK).json({
      data: data,
      msg: "fetched organization top risky assets",
    });
  } catch (err) {
    console.log("Failed to fetch organization risky assets", err);
    res.status(HttpStatusCodes.BAD_REQUEST).json({ error: err.message });
  }
});

router.get("/:orgId/org-top-risk-scenarios", async (req, res) => {
  try {
    const { orgId } = req.params;
    if (!orgId) {
      throw new Error("Org ID required");
    }
    const requiredCount = req.query.requiredCount ?? 5;
    const data = await ReportsService.topNRiskScenarios(orgId, requiredCount);
    res.status(HttpStatusCodes.OK).json({
      data: data,
      msg: "fetched organization top riskscenarios",
    });
  } catch (err) {
    console.log("Failed to fetch organization riskscenarios", err);
    res.status(HttpStatusCodes.BAD_REQUEST).json({ error: err.message });
  }
});

router.get("/:orgId/organization-risks", async (req, res) => {
  try {
    const { orgId } = req.params;
    if (!orgId) {
      throw new Error("Org ID required");
    }
    const asset = req.query.asset === "false" ? false : true;
    const riskScenario = req.query.riskScenario === "false" ? false : true;
    const requiredCount = req.query.requiredCount ?? 5;
    let data = {};

    if (asset) {
      const assetData = await ReportsService.topNRiskyAssets(orgId, requiredCount);
      data.assets = assetData;
    }
    if (riskScenario) {
      const riskScenarioData = await ReportsService.topNRiskScenarios(
        orgId,
        requiredCount
      );
      data.riskScenarios = riskScenarioData;
    }

    res.status(HttpStatusCodes.OK).json({
      data: data,
      msg: "fetched organization top riskscenarios",
    });
  } catch (err) {
    console.log("Failed to fetch organization riskscenarios", err);
    res.status(HttpStatusCodes.BAD_REQUEST).json({ error: err.message });
  }
});

router.get("/:orgId/asset-million-dollar-risk-chart", async (req, res) => {
  try {
    const { orgId } = req.params;
    if (!orgId) {
      throw new Error("Org ID required");
    }
    const requiredCount = req.query.requiredCount ?? 5;
    const data = await ReportsService.assetRiskScoresInMillionDollar(orgId);
    res.status(HttpStatusCodes.OK).json({
      data: data,
      msg: "fetched organization asset risk in million dollar",
    });
  } catch (err) {
    console.log(
      "Failed to fetch organization asset risk in million dollar",
      err
    );
    res.status(HttpStatusCodes.BAD_REQUEST).json({ error: err.message });
  }
});

router.get("/:orgId/asset-risk-score", async (req, res) => {
  try {
    const { orgId } = req.params;
    if (!orgId) {
      throw new Error("Org ID required");
    }
    const dollar = req.query.dollar === "false" ? false : true;
    const score = req.query.score === "false" ? false : true;
    const data = await ReportsService.assetRiskScores(orgId, dollar, score);
    res.status(HttpStatusCodes.OK).json({
      data: data,
      msg: "fetched organization asset risk in million dollar",
    });
  } catch (err) {
    console.log(
      "Failed to fetch organization asset risk in million dollar",
      err
    );
    res.status(HttpStatusCodes.BAD_REQUEST).json({ error: err.message });
  }
});

module.exports = router;
