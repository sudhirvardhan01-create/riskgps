require("dotenv").config();
const express = require("express");
const app = express();
const riskScenarioRoutes = require("./routes/risk_scenario");
const metaDataRoutes = require("./routes/meta_data");
const processRoutes = require("./routes/process");
const assetRoutes = require("./routes/asset");
const db = require("./models");
const authRoutes = require("./routes/authRoutes");
const errorHandler = require("./middleware/errorHandler");
const mitreThreatsControlRoutes = require("./routes/mitre_theat_control");
const controlsRoutes = require("./routes/controls");
const organizationRoutes = require("./routes/organization");
const assessmentRoutes = require("./routes/assessment");
const libraryRoutes = require("./routes/library");
const questionnaireRoutes = require("./routes/questionnaire");
const userRoutes = require("./routes/user");
const reportsRoute = require("./routes/reports");
const cors = require("cors");
app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:3000"],
  })
);

app.get("/api/health", (req, res) => {
  res.send("RiskGPS powered by BluOcean");
});

/**
 * Library Routes
 */
app.use("/library/process", processRoutes);
app.use("/library/risk-scenario", riskScenarioRoutes);
app.use("/library/meta-data", metaDataRoutes);
app.use("/library/mitre-threats-controls", mitreThreatsControlRoutes);

app.use("/library/controls", controlsRoutes);

app.use("/library/asset", assetRoutes);

app.use("/library/", libraryRoutes);
app.use("/library/questionnaire", questionnaireRoutes);

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/organization", organizationRoutes);
app.use("/assessment", assessmentRoutes);
app.use("/reports", reportsRoute);

app.use(errorHandler);

module.exports = app;
