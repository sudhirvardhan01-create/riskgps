const app = require("./server");
const db = require("./models");

const port = 8000;

db.sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log("RiskGPS Server started on port " + port);
  });
});
