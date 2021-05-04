import {Data} from "ws";
const fs = require('fs')
import WebSocket = require("ws");
import * as https from 'https';
const http = require('http');
import {options, port, service, Session, sid} from "./Config/Config";
const express = require('express');
const cookieParser = require('cookie-parser');
const {
    Worker, isMainThread, parentPort, workerData
} = require('worker_threads');
export const app = express();
const expressWs = require('express-ws')(app);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use('/login', require('./User/Login'));
app.use('/register', require('./User/Register'));
app.use('/', require('./Home/Home'));

//initialize a https server
const server = http.createServer(options, app);
// const server = https.createServer(options, app);
// server.on('upgrade', (req: any, socket, res) => {
//     console.log('upgrade')
// })
//start our server
server.listen( port,() => {
    console.log(`Server is running on port ${port}`);
})
var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({server: server});
wss.on('connection', function(ws: any) {
    console.log('Here')
    ws.on('message', function(message: any) {
        console.log('received: %s', message);
        ws.send("You said: "+ message);
    });
});
// app.get('/fib/:num', async (req: any, res: any) => {
//     const session_id = Session.session_id_specifier++;
//     Session.sessions[session_id] = service.openSession();
//     // const result = 10
//     const result = await promisedFib(req.params.num);
//     res.status(200);
//     res.cookie(sid, session_id, {})
//     res.send(`My first server!\n${result}\n:D`)
// })
//
// function promisedFib(n: number) {
//     return new Promise((resolve, reject) => {
//         resolve(fib(n))
//     })
// }
// function fib(n:number): number {
//     if(n == 0) return 0
//     else if (n == 1) return 1
//     else return fib (n-1) + fib(n -2)
// }