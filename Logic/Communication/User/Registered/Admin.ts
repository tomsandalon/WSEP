import {OK, ServerNotFound, service, Session, sid, Unauthorized} from "../../Config/Config";
const express = require('express');
const router = express.Router();
module.exports = router;
router.get('/history/user', (request: any, response: any) => {
    const user_id = Session.sessions[request.cookies[sid]].user_id;
    if (user_id == undefined) {
        response.status(ServerNotFound);
        response.send('Bad session id')
        response.end()
        return
    }
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
    const user_id = Session.sessions[request.cookies[sid]].user_id;
    if (user_id == undefined) {
        response.status(ServerNotFound);
        response.send('Bad session id')
        response.end()
        return
    }
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
    const user_id = Session.sessions[request.cookies[sid]].user_id;
    if (user_id == undefined) {
        response.status(ServerNotFound);
        response.send('Bad session id')
        response.end()
        return
    }
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