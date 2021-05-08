import {service, Session, sid} from "../Config/Config";

const fs = require('fs');
const path = require('path');
const express = require('express');
const router = express.Router();
module.exports = router;
const ws_client = path.join(__dirname, 'ws_client.html');
router.get('/',(request: any, response: any) => {
    console.log(
        `params:
        ${request.query.name}
        ${request.query.family}
        ${request.query.sex}`)
    // service.filterSearch(request.param);
    response.status(200);
    // const contentType = 'text/html';
    // response.set('Content-Type', contentType);
    response.setHeader("Content-Type", "application/json");
    // response.cookie(sid, session_id, {})
    // response.json(service.displayShops());
    response.end();
})
router.ws('/', function(ws: any, req: any) {
    ws.on('message', function(msg: any) {
        console.log(`received: ${msg}`);
        ws.send(`You said = ${msg}`)
    });
})