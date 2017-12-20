const WebSocket = require('ws');

const WebSocketServer = WebSocket.Server;

const wss = new WebSocketServer({
    port: 3000
});

let peoplearr = [];
let people = 0;
wss.on('connection', function (ws) {
    people++;
    //在线人数
    ws.send(`{"peoplenub":${people}}`, (err) => {
        if (err) {
            console.log(`[SERVER] error: ${err}`);
        }
    });
    console.log(`[SERVER] connection()`);
    ws.on('message', function (message) {
        console.log(`[SERVER] Received: ${message}`);
    });

    ws.on('close', function(close) {
        try{
            --people;
        }catch(e){
            console.log('刷新页面了');
        }
    });
});

console.log('ws server started at port 3000...');