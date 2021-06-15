import {BadRequest, OK, ServerNotFound, service, ServiceUnavailable, Session, sid} from "../Config/Config";
const express = require('express');
const router = express.Router();
module.exports = router;
router.post('/', (request: any, response: any) => {
    const session_data = Session.sessions[request.cookies[sid]];
    if (session_data == undefined) {
        response.status(ServerNotFound);
        response.send('Bad session id')
        response.end()
        return
    }
    if (!service.isAvailable()){
        response.status(ServiceUnavailable);
        response.end();
        return;
    }
    console.log("before register sid - :",request.cookies[sid]);
    const result = service.performRegister(request.body.email, request.body.password, request.body.age);
    console.log("after register result- ", result)
    response.setHeader("Content-Type", "text/html");
    if (result) {
        response.status(OK);
        response.send("Registration successful")
    } else {
        response.status(BadRequest);
        response.send("Registration failed, try again.")
    }
    response.end();
})