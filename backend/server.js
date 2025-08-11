require('dotenv').config();
const express = require("express");
const app = express();
const riskScenarioRoutes = require("./modules/library/routes/risk_scenario");
const metaDataRoutes = require("./modules/library/routes/meta_data");
const processRoutes = require("./modules/library/routes/process");
const db = require('./models');
const authRoutes = require('./routes/authRoutes');
const { authenticateJWT } = require('./middleware/authMiddleware');
const errorHandler = require('./middleware/errorHandler');


const cors = require('cors');
app.use(express.json());

app.use(cors({
  origin: ['http://localhost:3000']
}));
const port = 8000;

app.get("/api/health", (req, res) => {
    res.send("Site is healthy");
})

/**
 * Library Routes 
 * 
 */
app.use("/library/process", processRoutes);

app.use("/library/risk-scenario", riskScenarioRoutes);

app.use("/library/meta-data", metaDataRoutes);
app.use('/auth', authRoutes);
// app.use('/users', userRoutes);
app.use(errorHandler);

db.sequelize.sync().then(() => {
  app.listen(port, () => {
      console.log("Server started on port " + port );
    });
});


