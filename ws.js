const { WebSocketServer } = require("ws");
const server = require("./app");

var wss = new WebSocketServer({ server });

wss.on("connection", function connection(ws) {
  console.log(typeof ws);
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

console.log("websocket server is running ");
