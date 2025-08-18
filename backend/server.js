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

app.use("/library/asset", assetRoutes);

app.use('/auth', authRoutes);

// app.use('/users', userRoutes);
app.use(errorHandler);

const port = 8000;

db.sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log("Server started on port " + port );
  });
});

// module.exports = app;


