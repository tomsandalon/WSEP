import {service, Session, sid} from "../../Config/Config";
const express = require('express');
const router = express.Router();
module.exports = router;

router.post('/assign/owner', (request: any, response: any) => {
    const user_id = Session.sessions[request.cookies[sid]];
    if (user_id == undefined) {
        response.status(404);
        response.send('Bad session id')
        response.end()
        return
    }
    const result = service.appointOwner(user_id, request.body.shop_id, request.body.email);
    if (typeof result === 'string') {
        response.status(400);
        response.setHeader("Content-Type", "text/html");
        response.send(result);
    } else {
        response.status(200);
        response.end();
    }
})

router.post('/assign/manager', (request: any, response: any) => {
    const user_id = Session.sessions[request.cookies[sid]];
    if (user_id == undefined) {
        response.status(404);
        response.send('Bad session id')
        response.end()
        return
    }
    const result = service.appointManager(user_id, request.body.shop_id, request.body.email);
    if (typeof result === 'string') {
        response.status(400);
        response.setHeader("Content-Type", "text/html");
        response.send(result);
    } else {
        response.status(200);
        response.end();
    }
})