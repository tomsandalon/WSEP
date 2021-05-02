import {Data} from "ws";
const fs = require('fs')
import WebSocket = require("ws");
import * as https from 'https';
import {sleep} from "async-parallel";
import {System} from "../../Tests/AcceptanceTests/System";
import {SystemDriver} from "../../Tests/AcceptanceTests/SystemDriver";
import {Service} from "../Service/Service";
const app = require('express');
const host = 'localhost'
const port = 8000
const config_path = "./Logic/Communication/Config/";
const key_file = "server_key.pem";
const cert_file = "server_cert.pem";
const options = {
    key: fs.readFileSync(config_path + key_file, "utf8"),
    cert: fs.readFileSync(config_path + cert_file, "utf8"),
};
//initialize a simple http server
const server = https.createServer(options, (req, res) =>{
    res.writeHead(200)
    res.end("My first server!\n" + req.url + "\n:D")
});

//initialize the WebSocket server instance
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws: WebSocket) => {
    //connection is up, let's add a simple simple event
    ws.on('message', (message: string) => {
        //log the received message and send it back to the client
        console.log('received: %s', message);
        ws.send(`Hello, you sent -> ${message}`);
    });
    //send immediatly a feedback to the incoming connection
    ws.send('Hi there, I am a WebSocket server');
});

//start our server
server.listen( port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});
// const wss = new WebSocket.Server({
//     port: 8080,
//     perMessageDeflate: {
//         zlibDeflateOptions: {
//             // See zlib defaults.
//             chunkSize: 1024,
//             memLevel: 7,
//             level: 3
//         },
//         zlibInflateOptions: {
//             chunkSize: 10 * 1024
//         },
//         // Other options settable:
//         clientNoContextTakeover: true, // Defaults to negotiated value.
//         serverNoContextTakeover: true, // Defaults to negotiated value.
//         serverMaxWindowBits: 10, // Defaults to negotiated value.
//         // Below options specified as default values.
//         concurrencyLimit: 10, // Limits zlib concurrency for perf.
//         threshold: 1024 // Size (in bytes) below which messages
//         // should not be compressed.
//     }
// });
// const system: Service = new Service();
// const wss = new WebSocket.Server({ port: 80 });
// const client_dict: {[client_id: number]: WebSocket} = {};
// wss.on('connection', function connection(ws: WebSocket) {
//     let id: number = system.openSession();
//     client_dict[id] = ws;
//     ws.on('message', function incoming(message: Data) {
//         ws.send(`Hey you are client ${id}`)
//         // sleep(1000).then(_ => ws.send(`Hey you are client ${id}`))
//
//     });
// });
// console.log("Server successful boot")
