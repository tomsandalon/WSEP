import {service, Session, sid} from "../../Config/Config";
const express = require('express');
const router = express.Router();
module.exports = router;

router.post('/', (request: any, response: any) => {
    const user_id = Session.sessions[request.cookies[sid]];
    if (user_id == undefined) {
        response.status(404);
        response.send('Bad session id')
        response.end()
        return
    }
    const user_id_new = service.performLogin(request.body.email, request.body.password);
    response.setHeader("Content-Type", "text/html");
    if (typeof user_id_new === 'string') {
        response.status(401);
        response.send(user_id_new);
        return;
    } else {
        Session.sessions[request.cookies[sid]] = user_id_new;
        response.status(200);
        response.end();
    }
})