const { WebSocketServer } = require("ws");
require("dotenv").config()
const http = require('http')
const { app, sessionParser } = require("./app");
const mongoConnect = require("./services/mongo");
const { findUserById } = require("./routes/user/2userMongo");

const MONGO_URI = process.env.MONGO_URI

const server = http.createServer(app);

const wss = new WebSocketServer({ noServer: true, path: '/chat', clientTracking: false });

const clients = new Set()

server.on("upgrade", function (req, socket, head) {
  var pathname = require('url').parse(req.url).pathname;
  console.log("req.path{upgrd}", req.path);
  console.log("req.headers{upgrd}", req.headers);
  sessionParser(req, {}, async function () {
    // if (!req.session.userId) {
    //   socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
    //   socket.destroy();
    //   return;
    // }
    console.log("req.session{upgrdSess}|>", req.session);
    console.log("req.url{upgrdSess}|>", req.url);

    let clntUser
    try {
      clntUser = await findUserById(req.session.passport.user)
      console.log("clntUser|>", clntUser);
    } catch (error) {
      console.log("error findUserById in uograde listener");
      socket.destroy(error);
      return
    }

    const clntName = clntUser.username
    wss.handleUpgrade(req, socket, head, function (ws) {
      wss.emit('connection', ws, req, clntName);
    });
  })
})

wss.on("connection", function connection(ws, req, clntName) {
  clients.add(ws)
  console.log("clients|>", clients);
  console.log("clntName|>", clntName);
  ws.on("message", function message(message) {
    // console.log("req.cookies1|>",req.cookies);
    // if (message.toString() === "exit") {
    //   ws.close();
    // } else {
    console.log(`Received message ${message} from user ${clntName}`);
    clients.forEach(function (client) {
      client.send(message.toString());
    });

    console.log("SERVER SIDE::", message.toString());
  });

  ws.send("Hello");
  console.log("websocket server is running ");
});

async function start() {
  server.listen(app.get("PORT"), () => {
    console.log(`server is listening on port ${app.get("PORT")}`);
  });
  await mongoConnect(MONGO_URI)
}

start();