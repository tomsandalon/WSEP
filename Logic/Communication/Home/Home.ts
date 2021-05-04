import {service, sid, Session} from "../Config/Config";
import {app} from "../Server";

const fs = require('fs');
const path = require('path');
const express = require('express');
const router = express.Router();
module.exports = router;

router.get('/',(request: any, response: any) => {
    const session_id = Session.session_id_specifier++;
    Session.sessions[session_id] = service.openSession();
    // const result = await promisedFib(req.params.num);
    const contentType = 'text/html';
    fs.readFile(path.join(__dirname, 'ws_client.html'), (error: any, content: any) => {
        response.status(200);
        response.set('Content-Type', contentType);
        response.cookie(sid, session_id, {})
        response.end(content, 'utf-8');
    });
})
router.ws('/', function(ws: any, req: any) {
    ws.on('message', function(msg: any) {
        console.log(`received: ${msg}`);
        ws.send(`You said = ${msg}`)
    });
})