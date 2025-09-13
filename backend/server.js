require('dotenv').config();
const express = require("express");
const app = express();
const riskScenarioRoutes = require("./routes/risk_scenario");
const metaDataRoutes = require("./routes/meta_data");
const processRoutes = require("./routes/process");
const assetRoutes = require("./routes/asset")
const db = require('./models');
const authRoutes = require('./routes/authRoutes');
const errorHandler = require('./middleware/errorHandler');
const mitreThreatsControlRoutes = require("./routes/mitre_theat_control")
const organizationRoutes = require("./routes/organization");
const assessmentRoutes = require("./routes/assessment");
const cors = require('cors');
app.use(express.json());

app.use(cors({
  origin: ['http://localhost:3000']
}));

app.get("/api/health", (req, res) => {
    res.send("Site is healthy");
});

/**
 * Library Routes 
 */
app.use("/library/process", processRoutes);
app.use("/library/risk-scenario", riskScenarioRoutes);
app.use("/library/meta-data", metaDataRoutes);
app.use("/library/mitre-threats-controls", mitreThreatsControlRoutes);
app.use("/library/asset", assetRoutes);
app.use('/auth', authRoutes);
// app.use('/users', userRoutes);
app.use("/organization", organizationRoutes);
app.use("/assessment", assessmentRoutes);
app.use(errorHandler);

module.exports = app;