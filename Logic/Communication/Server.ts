import {request} from "express";

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
export const server = https.createServer(options, app);
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
app.use('/cart', require('./User/Cart'));
app.use('/home', require('./Home/Home'));
app.use('/home/filter', require('./Home/Filter'));
app.use('/user/shop/management', require('./User/Management'));

const second = 1000;
const minute = 60 * second;
const hour = 60 * minute;
const day = 24 * hour;
app.get('/guest',(request: any, response: any) => {
    const user_id = Session.sessions[request.cookies[sid]];
    let session_id = request.cookies[sid];
    response.status(200);
    response.setHeader("Content-Type", "application/json");
    if (user_id == undefined) {
        session_id = Session.session_id_specifier++;
        Session.sessions[session_id] = service.openSession();
    }
    response.cookie(sid, session_id, {
        maxAge: 2 * hour
    })
    response.end();
})
//* For debug TODO delete this

service.initData();