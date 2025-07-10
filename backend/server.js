require('dotenv').config();
const express = require("express");
const app = express();
const db = require('./models');
const userRoutes = require('./routes/userRoutes');
app.use(express.json());

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

