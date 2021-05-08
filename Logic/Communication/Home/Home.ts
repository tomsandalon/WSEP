import {service, Session, sid} from "../Config/Config";

const fs = require('fs');
const path = require('path');
const express = require('express');
const router = express.Router();
module.exports = router;
const ws_client = path.join(__dirname, 'ws_client.html');
router.get('/',(request: any, response: any) => {
    response.status(200);
    response.setHeader("Content-Type", "application/json");
    response.json(service.displayShops());
    response.end();
})
router.ws('/', function(ws: any, req: any) {
    ws.on('message', function(msg: any) {
        console.log(`received: ${msg}`);
        ws.send(`You said = ${msg}`)
    });
})