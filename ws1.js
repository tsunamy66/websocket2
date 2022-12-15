var http = require("http");
var fs = require("fs");
var { WebSocketServer } = require("ws");

const server = http.createServer();
const wss = new WebSocketServer({ noServer: true });

wss.on("connection", function connection(ws) {
  ws.on("message", function message(data) {
    console.log("received: %s", data);
  });

  ws.send("something");
});

server.listen(8080);
