import {Data} from "ws";
const fs = require('fs')
import WebSocket = require("ws");
import * as https from 'https';
import {sleep} from "async-parallel";
import {System} from "../../Tests/AcceptanceTests/System";
import {SystemDriver} from "../../Tests/AcceptanceTests/SystemDriver";
import {Service} from "../Service/Service";
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const app = express();
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
const host = 'localhost'
const port = 8000
const config_path = "./Logic/Communication/Config/";
const key_file = "server_key.pem";
const cert_file = "server_cert.pem";
const options = {
    key: fs.readFileSync(config_path + key_file, "utf8"),
    cert: fs.readFileSync(config_path + cert_file, "utf8"),
};
const service: Service = new Service();
let sessions: {[session_id: number] : number} = {};
let session_id_specifier = 1;
const sid = 'SID';
//initialize a https server
const server = https.createServer(options, app);
app.get('/', (req: any, res: any) => {
    const session_id = session_id_specifier++;
    sessions[session_id] = service.openSession();
    res.status(200);
    res.cookie(sid, session_id, {})
    res.send("My first server!\n" + req.url + "\n:D")
})
app.post('/login', (req: any, res: any) => {
    let user_id = parseInt(req.cookies[sid]);
    if (isNaN(user_id)) {
        console.log("Error")
        res.status(404);
        res.send('Bad session id')
    } else {
        console.log("Here")
        const result = service.performLogin(req.body.user, req.body.password);
        if (typeof result === 'string') {
            console.log("Bad")
            res.status(200);
            res.send(result)
        } else {
            console.log("Ok")
            res.status(200);
            res.send("Welcome!\n")
        }
    }
})
// server.on('request', (req, res) =>{
//     console.log("REQ " + req.getHeader('Set-Cookie'))
//     // res.setHeader('set-cookie', 'foo=bar')
//     // To Write a Cookie
//     // res.cookie.cookie = "name=mark"
//     // res.setHeader('Cookie', ['type=ninja', 'language=javascript']);
//     res.writeHead(200);
//     res.end("My first server!\n" + req.url + "\n:D")
// })

//start our server
server.listen( port,() => {
    console.log(`Server is running on port ${port}`);
});