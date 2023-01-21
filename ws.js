const { WebSocketServer } = require("ws");
const WebSocket = require("ws");
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
  console.log("req.path{upgrd}", pathname);
  console.log("req.headers{upgrd}", req.headers);
  sessionParser(req, {}, async function () {

    if (!req.session?.passport) {
      socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
      socket.destroy();
      return;
    }

    // console.log("req.session{upgrdSess}|>", req.session);
    // console.log("req.url{upgrdSess}|>", req.url);

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
      Object.assign(ws, {
        user: {
          username: clientName,
          id
        }
      })
      
      console.log("ws.user|>", ws.user);
      
      clients.forEach(function iamonline(client) {
        if (client !== ws && client.readyState === WebSocket.OPEN && client != ws) {
          client.send(JSON.stringify(ws.user))
        }
      })

      clients.add(ws);
      wss.emit('connection', ws, req, ws.user.username);
    });
  });
});

wss.on("connection", function connection(ws, req, username) {
  console.log(clients.size);
  // console.log("websocket.OPEN|>", WebSocket.OPEN);
  // console.log("clntName|>", username);
  ws.on("message", function message(message) {

    console.log(`Received message ${message} from user ${username}`);
    console.log("message|>", message);
    clients.forEach(function (client) {
      // console.log("client.username|>",client.user.username);
      if (client.readyState === WebSocket.OPEN && ws != client) {
        let messageUsernameId = JSON.stringify(client.user).concat(message.toString())
        console.log(messageUsernameId);
        client.send(messageUsernameId,{binary:true});
      };
    });

    console.log("SERVER SIDE::", message.toString());
  });

  ws.send("Hello",{binary:true}); //ws.emit("message","Hello")

  ws.on("close", function close() {
    clients.delete(ws)
  })

});

async function start() {
  server.listen(app.get("PORT"), () => {
    console.log(`server is listening on port ${app.get("PORT")}`);
  });
  await mongoConnect(MONGO_URI)
}

start();