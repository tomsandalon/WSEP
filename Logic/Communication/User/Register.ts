import {service, Session, sid} from "../Config/Config";
const express = require('express');
const router = express.Router();
module.exports = router;
router.get('/', (request: any, res: any) => {
    console.log('Nothing')
})
router.post('/', (request: any, response: any) => {
    const user_id = Session.sessions[request.cookies[sid]];
    if (user_id == undefined) {
        response.status(404);
        response.send('Bad session id')
        response.end()
    }
    const result = service.performRegister(request.body.email, request.body.password);
    console.log(request.body.email, request.body.password)
    response.setHeader("Content-Type", "text/html");
    if (result) {
        response.status(200);
    } else {
        response.status(400);
    }
    response.end();
})