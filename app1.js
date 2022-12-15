const { createServer } = require('http');
const { parse } = require('url');
const { WebSocketServer } = require('ws');

const server = createServer();
const wss1 = new WebSocketServer({ noServer:true });
const wss2 = new WebSocketServer({ noServer:true });

wss1.on('connection', (ws) => {
  // connection is up, let's add a simple simple event
  ws.on('message', (message) => {
      //log the received message and send it back to the client
      console.log('received: %s', message);
      ws.send(`Hello, you sent -> ${message}`);
  });
  //send immediatly a feedback to the incoming connection    
  ws.send('Hi there, I am a WebSocket server(app1)');
});

// wss2.on('connection', function connection(ws) {
//   // ...
// });

server.on('upgrade', function upgrade(request, socket, head) {
  const { pathname } = parse(request.url);
  console.log(pathname);
  if (pathname === '/foo') {
    wss1.handleUpgrade(request, socket, head, function done(ws) {
      wss1.emit('connection', ws, request);
    });
  } else if (pathname === '/bar') {
    wss2.handleUpgrade(request, socket, head, function done(ws) {
      wss2.emit('connection', ws, request);
    });
  } else {
    socket.destroy();
  }
});

server.listen(8080);