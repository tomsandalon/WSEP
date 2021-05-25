import {OK, ServerNotFound, service, Session, sid, Unauthorized} from "../../Config/Config";
import {acknowledge_for_notifications} from "../../WSEvents";
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
    const user_id_new = service.performLogin(request.body.email, request.body.password);
    response.setHeader("Content-Type", "text/html");
    if (typeof user_id_new === 'string') {
        response.status(Unauthorized);
        response.send(user_id_new);
        return;
    } else {
        Session.sessions[request.cookies[sid]].user_id = user_id_new;
        response.status(OK);
        response.end();
        if (Session.publisher.hasNotifications(user_id_new)) {
            session_data.socket.emit(acknowledge_for_notifications, true)
        }
    }
})