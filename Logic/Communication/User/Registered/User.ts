import {OK, ServerNotFound, service, Session, sid, Unauthorized} from "../../Config/Config";
const express = require('express');
const router = express.Router();
module.exports = router;
router.get('/', (request: any, response: any) => {
    const user_id = Session.sessions[request.cookies[sid]];
    if (user_id == undefined) {
        response.status(ServerNotFound);
        response.send('Bad session id')
        response.end()
        return
    }
    const result = service.getAllShops(user_id);
    if (typeof result == 'string'){
        response.status(Unauthorized)
        response.setHeader("Content-Type", "text/html");
        response.send(result)
    } else {
        response.status(OK)
        response.setHeader("Content-Type", "application/json");
        response.json(result)
    }
    response.end();
})