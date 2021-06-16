import {OK, service, ServiceUnavailable, Session, sid} from "../Config/Config";

const express = require('express');
const router = express.Router();
module.exports = router;
router.get('/',(request: any, response: any) => {
    if (!service.isAvailable()){
        response.status(ServiceUnavailable);
        response.end();
        return;
    }
    const session_data = Session.sessions[request.cookies[sid]];
    let session_id = request.cookies[sid];
    response.status(OK);
    response.setHeader("Content-Type", "application/json");
    if (session_data == undefined) {
        session_id = Session.session_id_specifier++;
        console.log("connection to a new guest sid - ", session_id);
        Session.sessions[session_id] = {
            user_id: service.openSession(),
            socket: null
        };
    }
    response.cookie(sid, session_id, {})
    response.end();
})
