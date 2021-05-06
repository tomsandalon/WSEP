const fs = require('fs')
import * as https from 'https';
import {options, port, service, Session, sid} from "./Config/Config";
const path = require('path');
const express = require('express');
const expressWs = require('express-ws');
const cookieParser = require('cookie-parser');
const {
    Worker, isMainThread, parentPort, workerData
} = require('worker_threads');
export const app = express();
//initialize a https server
const server = https.createServer(options, app);
//start our server
server.listen( port,() => {
    console.log(`Server is running on port ${port}`);
})
expressWs(app, server);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use('/login', require('./User/Login'));
app.use('/register', require('./User/Register'));
app.use('/home', require('./Home/Home'));

//* For debug TODO delete this

service.initData();

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