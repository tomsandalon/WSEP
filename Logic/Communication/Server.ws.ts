import { Worker,  isMainThread, parentPort, workerData  } from "worker_threads";
import {server} from "./Server";

// declare module WorkerLoader {
//     // You need to change `Worker`, if you specified a different value for the `workerType` option
//     class WebpackWorker extends Worker {
//         constructor();
//     }
//     // Uncomment this if you set the `esModule` option to `false`
// }
const fs = require('fs');
const path = require('path');
var httpServer = server;

var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({server:httpServer});
wss.on('connection', function(ws: any) {
    console.log("Connection!!")
    ws.on('message', function(message: any) {
        console.log('received: %s', message);
        ws.send("You said: "+ message);
    });
});