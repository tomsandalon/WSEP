import {Data} from "ws";
const fs = require('fs')
import WebSocket = require("ws");
import * as https from 'https';
import {sleep} from "async-parallel";
import {System} from "../../Tests/AcceptanceTests/System";
import {SystemDriver} from "../../Tests/AcceptanceTests/SystemDriver";
import {Service} from "../Service/Service";
const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
app.use(cookieParser());
const host = 'localhost'
const port = 8000
const config_path = "./Logic/Communication/Config/";
const key_file = "server_key.pem";
const cert_file = "server_cert.pem";
const options = {
    key: fs.readFileSync(config_path + key_file, "utf8"),
    cert: fs.readFileSync(config_path + cert_file, "utf8"),
};
//initialize a https server
const server = https.createServer(options, app);
app.get('/', (req: any, res: any) => {
    res.cookie('foo', 'bar', {})
    res.cookie('jonny', 'sins', {})
    res.send("My first server!\n" + req.url + "\n:D")
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