const { WebSocketServer } = require('ws');

var wss = new WebSocketServer({ port: 3000 });

wss.on('connection', function connection(ws) {
    console.log(typeof(ws))
    ws.on('message', function message(message) {
        if (message.toString() === 'exit') {
            ws.close();
        } else {
          wss.clients.forEach(function (client) {
              client.send(message.toString())
          })
        }
        console.log(message.toString());
    });
    ws.send('Hello World!!');
});

console.log('websocket server is running on port 3000');