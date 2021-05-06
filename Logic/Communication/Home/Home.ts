import {service, Session, sid} from "../Config/Config";

const fs = require('fs');
const path = require('path');
const express = require('express');
const router = express.Router();
module.exports = router;
const ws_client = path.join(__dirname, 'ws_client.html');
router.get('/',(request: any, response: any) => {
    const session_id = Session.session_id_specifier++;
    Session.sessions[session_id] = service.openSession();
    response.status(200);
    // const contentType = 'text/html';
    // response.set('Content-Type', contentType);
    response.setHeader("Content-Type", "application/json");
    response.cookie(sid, session_id, {})
    response.json(service.displayShops());
    response.end();
    //`Your session id is ${session_id}, lior result = ${lior_result}`
    // const result = await promisedFib(req.params.num);
    // fs.readFile(path.join(__dirname, 'build', 'index.html'), (error: any, content: any) => {
    //     response.status(200);
    //     response.set('Content-Type', contentType);
    //     response.cookie(sid, session_id, {})
    //     response.end(content, 'utf-8');
    // });
})
router.ws('/', function(ws: any, req: any) {
    ws.on('message', function(msg: any) {
        console.log(`received: ${msg}`);
        ws.send(`You said = ${msg}`)
    });
})