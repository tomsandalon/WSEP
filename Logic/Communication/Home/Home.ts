import {service, sid, Session} from "../Config/Config";

const fs = require('fs');
const path = require('path');
const express = require('express');
const router = express.Router();
module.exports = router;

router.get('/',(request: any, response: any) => {
    console.log(request.url)
    if(request.url != ''){//request.url is the file being requested by the client
        var contentType = 'text/html';
        fs.readFile(path.join(__dirname, 'ws_client.html'), (error: any, content: any) => {
            response.writeHead(200, { 'Content-Type': contentType });
            response.end(content, 'utf-8');
        });
    }
    // const session_id = Session.session_id_specifier++;
    // Session.sessions[session_id] = service.openSession();
    // const result = 10
    // // const result = await promisedFib(req.params.num);
    // res.status(200);
    // res.cookie(sid, session_id, {})
    // res.send(`My first server!\n${result}\n:D`)
})