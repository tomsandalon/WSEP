import WebSocket = require("ws");
import {sleep} from "async-parallel";
// const socket = new WebSocket('ws://localhost:8080');// connect
//
// // Connection opened
// socket.addEventListener('open', function (event) {
//     socket.send('Hello Server!');
// });
//
// // Listen for messages
// socket.addEventListener('message', function (event) {
//     console.log('Message from server ', event.data);
// });

const id = Math.random()
const ws = new WebSocket('ws://localhost:8080');

ws.on('open', function open() {
    ws.send(`Hi I am ${id}`);
});

ws.on('message', function incoming(data) {
    console.log(data);
    sleep(1000).then(_ => ws.send(`Hey ${id}`))
});
console.log(`Client ${id} successful boot`)