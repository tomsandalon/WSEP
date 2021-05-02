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
//initialize a https server
const server = https.createServer(options, (req, res) =>{
    res.writeHead(200)
    res.end("My first server!\n" + req.url + "\n:D")
});
