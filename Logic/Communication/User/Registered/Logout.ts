import {hour, service, Session, sid} from "../../Config/Config";

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
    const result = service.logout(user_id);
    if(typeof result == "string"){
        response.status(400);
    }else {
        response.status(200);
        Session.sessions[request.cookies[sid]] = service.openSession();
    }
    response.end();
})