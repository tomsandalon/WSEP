import {OK, ServerNotFound, service, ServiceUnavailable, Session, sid, Unauthorized} from "../../Config/Config";
const express = require('express');
const router = express.Router();
module.exports = router;
router.get('/history/user', (request: any, response: any) => {
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
    const user_id = session_data.user_id;
    response.setHeader("Content-Type", "application/json");
    const result = service.adminDisplayUserHistory(user_id, request.query.user_inspect);
    if (typeof result === 'string') {
        response.status(Unauthorized);
        response.setHeader("Content-Type", "text/html");
        response.send(result);
    } else {
        response.status(OK);
        response.setHeader("Content-Type", "application/json");
        response.json(result);
    }
    response.end();
})
router.get('/history/shop', (request: any, response: any) => {
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
    const user_id = session_data.user_id;
    response.setHeader("Content-Type", "application/json");
    const result = service.adminDisplayShopHistory(user_id, request.query.shop_id);
    if (typeof result === 'string') {
        response.status(Unauthorized);
        response.setHeader("Content-Type", "text/html");
        response.send(result);
    } else {
        response.status(OK);
        response.setHeader("Content-Type", "application/json");
        response.json(result);
    }
    response.end();
})
router.get('/users', (request: any, response: any) => {
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
    const user_id = session_data.user_id;
    const result = service.getAllUsers(user_id)
    if (typeof result === 'string') {
        response.status(Unauthorized);
        response.setHeader("Content-Type", "text/html");
        response.send(result);
    } else {
        response.status(OK);
        response.setHeader("Content-Type", "application/json");
        response.json(result);
    }
    response.end();
})