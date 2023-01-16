const { WebSocketServer } = require("ws");
const websocket = require("ws");
require("dotenv").config();
const http = require('http');
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

    if (!req.session?.passport) {
      socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
      socket.destroy();
      return;
    }

    console.log("req.session{upgrdSess}|>", req.session);
    console.log("req.url{upgrdSess}|>", req.url);

    let clientUser
    const id = req.session.passport.user
    try {
      clientUser = await findUserById(id)
      console.log("clntUser|>", clientUser);
    } catch (error) {
      console.log("error findUserById in uograde listener");
      socket.destroy(error);
      return
    }

    const clientName = clientUser.username
    wss.handleUpgrade(req, socket, head, function (ws) {
      console.log("ws.user|>",ws.user);
      Object.assign(ws,{
        user : {
          username : clientName,
          id
        }
      })
      clients.add(ws);
      wss.emit('connection', ws, req, ws.user.username);
    });
  });
});

wss.on("connection", function connection(ws, req, username) {
  console.log("websocket.OPEN|>",websocket.OPEN);
  console.log("clntName|>", username);
  ws.on("message", function message(message) {

    console.log(`Received message ${message} from user ${username}`);
    clients.forEach(function (client) {
      // console.log("client.username|>",client.user.username);
      if (client.readyState === websocket.OPEN) {
        client.send(message.toString());
      };
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