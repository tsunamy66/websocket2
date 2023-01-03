const { WebSocketServer } = require("ws");
require("dotenv").config()
const http = require('http')
const { app, sess } = require("./app");
const mongoConnect = require("./services/mongo");

const cookieParser = require("cookie-parser")
const MONGO_URI = process.env.MONGO_URI

const server = http.createServer(app);

const wss = new WebSocketServer({ noServer: true, path: '/chat', clientTracking: false });

server.on("upgrade", function (req, socket, head) {
  console.log("req.url",req.url);
  console.log("req.path",req.path);
  console.log("req.headers",req.headers);
  sess(req, {}, function (sess) {
    // if (!req.session.userId) {
    //   socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
    //   socket.destroy();
    //   return;
    // }
    console.log("sess|>", sess);
    console.log("req.session|>", req.session);
    console.log("req.url|>",req.url);
    // return
    wss.handleUpgrade(req, socket, head, function (ws) {
      wss.emit('connection', ws, req);
    });
  })
  console.log("req.session1|>", req.session);
  // sessionParser(req, {}, () => {
  //   if (!req.session.userId) {
  //     socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
  //     socket.destroy();
  //     return;
  //   }
})

wss.on("connection", function connection(ws, req, clname) {
  // cookieParser()(req,{},function (params) {
  //   console.log("cookie parsed!!");
  // })
  // console.log("req.headers(ws)|>",req.headers);
  // console.log("req.cookies(ws)|>",req.cookies);
  // sess(req, {}, function (sess) {
  //   console.log("sess|>", sess);
  //   console.log("req.session|>", req.session);
  //   return
  // })
  // console.log("req.cookies|>",req.cookies);
  ws.on("message", function message(message) {
    // console.log("req.cookies1|>",req.cookies);
    // if (message.toString() === "exit") {
    //   ws.close();
    // } else {
    console.log(`Received message ${message} from user ${clname}`);
    ws.send(message.toString())
    // wss.clients.forEach(function (client) {
    //   client.send(message.toString());
    // });
    // }
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