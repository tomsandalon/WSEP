import {service, Session, sid} from "../Config/Config";
const express = require('express');
const router = express.Router();
module.exports = router;
router.post('/', (request: any, response: any) => {
    const user_id = Session.sessions[request.cookies[sid]].user_id;
    if (user_id == undefined) {
        response.status(404);
        response.send('Bad session id')
        response.end()
        return
    }
    const result = service.performRegister(request.body.email, request.body.password);
    response.setHeader("Content-Type", "text/html");
    if (result) {
        response.status(200);
        response.send("Registeration sucessful")
    } else {
        response.status(400);
        response.send("Registeration failed, try again.")
    }
    response.end();
})