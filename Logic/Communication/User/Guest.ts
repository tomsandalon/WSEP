import {service, Session, sid} from "../Config/Config";
import {hour} from "../Config/Config";
const express = require('express');
const router = express.Router();
module.exports = router;
router.get('/',(request: any, response: any) => {
    const user_id = Session.sessions[request.cookies[sid]];
    let session_id = request.cookies[sid];
    response.status(200);
    response.setHeader("Content-Type", "application/json");
    if (user_id == undefined) {
        session_id = Session.session_id_specifier++;
        Session.sessions[session_id] = service.openSession();
    }
    response.cookie(sid, session_id, {})
    response.end();
})