const { WebSocketServer } = require("ws");
const WebSocket = require("ws");
require("dotenv").config();
const http = require('http');
const { app, sessionParser } = require("./app");
const mongoConnect = require("./services/mongo");
const { findUserById } = require("./routes/users/2userModel");

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

    wss.handleUpgrade(req, socket, head, function (ws) {
      Object.assign(ws, {
        user: {
          username: clientUser.username,
          id
        }
      })

      console.log("ws.user|>", ws.user);

      clients.forEach(function iamonline(client) {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          //Sends online users: {username : ? , id : ?}
          client.send(JSON.stringify(ws.user), { binary: true })
          ws.send(JSON.stringify(client.user), { binary: true })
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

    const parsedRecievedMessage = JSON.parse(message.toString())
    if (parsedRecievedMessage.id != "Savedmessage") {
      // console.log(`Received message ${strMessage} from user ${username}`);
      clients.forEach(function (client) {
        // console.log("client.username|>",client.user.username);
        // let usernameIdMessage = JSON.stringify(client.user).concat(strMessage)
        if (parsedRecievedMessage.id == client.user.id && client.readyState === WebSocket.OPEN && ws != client) {
          // console.log('usernameIdMessage|>', usernameIdMessage);
          client.send(usernameIdMessage, { binary: true });
        };
      });
    }else{
      //save message in database
      console.log("parsedRecievedMessage|>", parsedRecievedMessage);
    }

    console.log("SERVER SIDE::", message.toString());
  });

  // ws.send("Hello",{binary:true}); //ws.emit("message","Hello")

  ws.on("close", function close() {
    clients.delete(ws)
  })

});

// async function parseRecievedMessage(message) {
//   const parsedRecievedMessage = JSON.parse(message.toString())

//   // let strMessage = message.toString()
//   // let index = strMessage.indexOf("}") + 1;
//   // let recievedMessage = strMessage.slice(index);
//   // console.log("recievedMessage|>", recievedMessage);
//   // let recieverUser = strMessage.substring(0, index);
//   // console.log("recieverUser|>", recieverUser);
//   // console.log("strMessage|>", strMessage);
// }

async function start() {
  server.listen(app.get("PORT"), () => {
    console.log(`server is listening on port ${app.get("PORT")}`);
  });
  await mongoConnect(MONGO_URI)
}

start();

module.exports = {
  clients
}