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
app.use('/home/filter', require('./Home/Filter'));

//* For debug TODO delete this

service.initData();