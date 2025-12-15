const app = require("./server");
const db = require("./models");
const wsManager = require("./utils/websocket");

const port = 8000;

db.sequelize.sync().then(() => {
  const server = app.listen(port, () => {
    console.log("RiskGPS Server v1.0 started on port " + port);
  });

  // Initialize WebSocket server
  wsManager.initialize(server);
});
