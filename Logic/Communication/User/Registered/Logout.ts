import {BadRequest, hour, OK, ServerNotFound, service, Session, sid} from "../../Config/Config";

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
    const user_id = session_data.user_id;
    const result = service.logout(user_id);
    if(typeof result == "string"){
        response.status(BadRequest);
    }else {
        response.status(OK);
        Session.sessions[request.cookies[sid]].user_id = service.openSession();
    }
    response.end();
})