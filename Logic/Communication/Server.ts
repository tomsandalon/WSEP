import {Data} from "ws";
const fs = require('fs')
import WebSocket = require("ws");
import * as https from 'https';
import {options, port, service, sid} from "./Config/Config";
const express = require('express');
const cookieParser = require('cookie-parser');
const {
    Worker, isMainThread, parentPort, workerData
} = require('worker_threads');
const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(require('./Login/Login'));
let sessions: {[session_id: number] : number} = {};
let session_id_specifier = 1;
//initialize a https server
const server = https.createServer(options, app);
//start our server
server.listen( port,() => {
    console.log(`Server is running on port ${port}`);
})
app.get('/fib/:num', async (req: any, res: any) => {
    const session_id = session_id_specifier++;
    sessions[session_id] = service.openSession();
    // const result = 10
    const result = await promisedFib(req.params.num);
    res.status(200);
    res.cookie(sid, session_id, {})
    res.send(`My first server!\n${result}\n:D`)
})
app.get('/', async (req: any, res: any) => {
    const session_id = session_id_specifier++;
    sessions[session_id] = service.openSession();
    const result = 10
    // const result = await promisedFib(req.params.num);
    res.status(200);
    res.cookie(sid, session_id, {})
    res.send(`My first server!\n${result}\n:D`)
})

function promisedFib(n: number) {
    return new Promise((resolve, reject) => {
        resolve(fib(n))
    })
}
function fib(n:number): number {
    if(n == 0) return 0
    else if (n == 1) return 1
    else return fib (n-1) + fib(n -2)
}
app.get('/register', (req: any, res: any) => {
    //TODO give html to client
    res.send("My first server!\n" + req.url + "\n:D")
})
app.post('/register', (req: any, res: any) => {
    let user_id = parseInt(req.cookies[sid]);
    if (isNaN(user_id)) {
        res.status(404);
        res.send('Bad session id')
    } else {
        const result = service.performRegister(req.body.user, req.body.password);
        res.status(200);
        if (result) {
            //TODO give html home page
            res.send("Welcome!\n")
        } else {
            res.send(result)
        }
    }
})
// app.get('/register', (req: any, res: any) => {
//     //TODO give html to client
//     res.send("My first server!\n" + req.url + "\n:D")
// })
// app.post('/register', (req: any, res: any) => {
//     let user_id = parseInt(req.cookies[sid]);
//     if (isNaN(user_id)) {
//         res.status(404);
//         res.send('Bad session id')
//     } else {
//         const result = service.performRegister(req.body.user, req.body.password);
//         res.status(200);
//         if (typeof result === 'string') {
//             res.send(result)
//         } else {
//             //TODO give html home page
//             res.send("Welcome!\n")
//         }
//     }
// })
// server.on('request', (req, res) =>{
//     console.log("REQ " + req.getHeader('Set-Cookie'))
//     // res.setHeader('set-cookie', 'foo=bar')
//     // To Write a Cookie
//     // res.cookie.cookie = "name=mark"
//     // res.setHeader('Cookie', ['type=ninja', 'language=javascript']);
//     res.writeHead(200);
//     res.end("My first server!\n" + req.url + "\n:D")
// })
