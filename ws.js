const { WebSocketServer } = require("ws");
const WebSocket = require("ws");
require("dotenv").config();
const http = require('http');
const { app, sessionParser } = require("./app");
const mongoConnect = require("./services/mongo");
const { findUserById, getAllUsers } = require("./routes/users/2userModel");
const { saveMessage, getAllMessages } = require("./routes/messages/2messageModel");

const MONGO_URI = process.env.MONGO_URI

const server = http.createServer(app);

const wss = new WebSocketServer({ noServer: true, path: '/chat', clientTracking: false });

const clients = new Set()

server.on("upgrade", function (req, socket, head) {
  var pathname = require('url').parse(req.url).pathname;
  // console.log("req.path{upgrd}", pathname);
  // console.log("req.headers{upgrd}", req.headers);
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
      clientUser = await findUserById(id);
      console.log("clntUser|>", clientUser);
    } catch (error) {
      console.log("error findUserById in uograde listener");
      socket.destroy(error);
      return
    }

    wss.handleUpgrade(req, socket, head, async function (ws) {
      Object.assign(ws, {
        user: {
          username: clientUser.username,
          id
        }
      })

      // console.log("ws.user|>", ws.user);

      let allUsers
      try {
        allUsers = await getAllUsers();
        console.log("allUsers|>", allUsers);
        allUsers.forEach(function (user) {
          console.log(user._id != id);
          if (user._id != id) {
            let newUser = {}
            newUser.id = user._id
            newUser.username = user.username
            ws.send(JSON.stringify(newUser), { binary: true })
          }
        })
      } catch (error) {
        console.log("can not find user in mongodb");
      }

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
  ws.on("message", async function message(message) {
    // message Example = {"recieverId":"client.user.id"or"Savedmessage","message":"salam khoobi?"}
    const parsedRecievedMessage = JSON.parse(message.toString())

    if (parsedRecievedMessage.recieverId != "Savedmessage") {
      console.log(`Received message ${parsedRecievedMessage.message} from user ${username}`);
      clients.forEach(async function (client) {
        // console.log("client.username|>",client.user.username);
        //Find reciever with Id
        if (parsedRecievedMessage.recieverId == client.user.id && client.readyState === WebSocket.OPEN && ws != client) {
          //Create object to save in database
          Object.assign(parsedRecievedMessage, {
            senderId: ws.user.id,
            senderUsername: ws.user.username,
            recieverUsername: client.user.username,
          })
          //Create object for send to client
          let senderMessage = {
            senderId: ws.user.id,
            // senderUsername: ws.user.username,
            message: parsedRecievedMessage.message,
          }
          //Save message in Database
          await saveMessage(parsedRecievedMessage)
          //Send to client
          client.send(JSON.stringify(senderMessage), { binary: true });
          return
        };
      });

    } else {
      //if recieverId == Savedmessage means that the message should only be stored in the database
      Object.assign(parsedRecievedMessage, {
        senderId: ws.user.id,
        senderUsername: ws.user.username,
        recieverUsername: ws.user.username,
      })
      await saveMessage(parsedRecievedMessage)
      return
    }

    if (parsedRecievedMessage.chatContentWithId) {
      let senderRecieverId = {
        senderId: ws.user.id,
        recieverId: parsedRecievedMessage.chatContentWithId,
      }
      try {
        let allMessages = await getAllMessages(senderRecieverId)
        console.log("allMessages|>", allMessages);
        allMessages.messages.forEach(function (msg) {

          let DBmessage = {
            //The message should be printed in the "class: chatContent" with this ID 
            senderId: parsedRecievedMessage.chatContentWithId,
            message: msg.message,
            //True recieved message from senderId
            //False sent message to senderId
            isSender: (msg.senderId != ws.user.id),//true or false
          }
          ws.send(JSON.stringify(DBmessage), { binary: true })

        })
      } catch (error) {

      }
    }
    // console.log("SERVER SIDE::", message.toString());
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