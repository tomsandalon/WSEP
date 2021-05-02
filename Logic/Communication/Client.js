const WebSocket = require("ws");
const {sleep} = require("async-parallel");
const fs = require('fs')
const path = require('path')
const https = require('https')

// import {sleep} from "async-parallel";
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
// const id = Math.random()
// const ws = new WebSocket('ws://localhost:8000');
//
// ws.on('open', function open() {
//     ws.send(`Hi I am ${id}`);
// });
// ws.on('message', function incoming(data) {
//     console.log(data);
//     sleep(1000).then(_ => ws.send(`Hey ${id}`))
// });
// console.log(`Client ${id} successful boot`)
const config_path = "./Logic/Communication/Config/";
const key_file = "server_key.pem";
const cert_file = "server_cert.pem";
const ca_file = "server_cert.pem"
const options = {
    hostname: 'localhost',
    port: 8000,
    path: '/',
    method: 'GET',
    key: fs.readFileSync(config_path + key_file, "utf8"),
    cert: fs.readFileSync(config_path + cert_file, "utf8"),
    requestCert: true,
    rejectUnauthorized: true,

    ca: [ fs.readFileSync(config_path + ca_file) ],
}

const req = https.request(options, function (res) {
    console.log('STATUS: ' + res.statusCode);
    console.log('HEADERS: ' + JSON.stringify(res.headers));
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
        console.log('BODY: ' + chunk);
    });
});
req.end()