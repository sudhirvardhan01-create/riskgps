require('dotenv').config();
const express = require("express");
const app = express();
const db = require('./models');
const userRoutes = require('./routes/userRoutes');
const cors = require('cors');
app.use(express.json());

app.use(cors({
  origin: ['http://localhost:3001', 'http://localhost:3002']
}));
const port = 3001;

app.get("/health", (req, res) => {
    res.send("Site is healthy");
})


app.use('/users', userRoutes);

db.sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log("Server started on port " + port );
  });
});

