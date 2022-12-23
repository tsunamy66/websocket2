const { WebSocketServer } = require("ws");
const http = require('http')
const app = require("./app");

const server = http.createServer(app);

const wss = new WebSocketServer({ server });

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
});

server.listen(app.get("PORT"), () => {
  console.log(`server is listening on port ${app.get("PORT")}`);
});

console.log("websocket server is running ");