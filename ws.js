const { WebSocketServer } = require("ws");
require("dotenv").config()
const http = require('http')
const app = require("./app");
const mongoConnect = require("./services/mongo");

const MONGO_URI = process.env.MONGO_URI

const server = http.createServer(app);

const wss = new WebSocketServer({ server ,path:'/chat'});

wss.on("connection", function connection(ws) {
  ws.on("message", function message(message) {
    if (message.toString() === "exit") {
      ws.close();
    } else {
      console.log("client::", wss.clients.size);
      wss.clients.forEach(function (client) {
        client.send(message.toString());
      });
    }
    console.log("SERVER SIDE::", message.toString());
  });
  ws.send("Hello World!!");
  console.log("websocket server is running ");
});

async function start() {
  server.listen(app.get("PORT"), () => {
    console.log(`server is listening on port ${app.get("PORT")}`);
  });
  await mongoConnect(MONGO_URI)
}

start();