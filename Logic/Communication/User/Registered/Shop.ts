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
    }
    const result = service.addShop(user_id, request.body.name, request.body.description, request.body.location, request.body.bank_info);
    response.setHeader("Content-Type", "text/html");
    if (typeof result === 'string') {
        response.status(400);
    } else {
        response.status(200);
    }
    response.send(result);
    response.end();
})