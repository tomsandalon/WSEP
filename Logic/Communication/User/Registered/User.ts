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
    const result = service.getManagingShops(user_id);
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
router.get('/permissions', (request: any, response: any) => {
    const user_id = Session.sessions[request.cookies[sid]];
    if (user_id == undefined) {
        response.status(ServerNotFound);
        response.send('Bad session id')
        response.end()
        return
    }
    const result = service.getPermissions(user_id, request.body.shop_id);
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
router.get('/is/loggedin', (request: any, response: any) => {
    const user_id = Session.sessions[request.cookies[sid]];
    if (user_id == undefined) {
        response.status(ServerNotFound);
        response.send('Bad session id')
        response.end()
        return
    }
    const result = service.isLoggedIn(user_id);
    response.setHeader("Content-Type", "text/html");
    response.status(OK)
    response.send(result)
    response.end();
})
router.get('/is/admin', (request: any, response: any) => {
    const user_id = Session.sessions[request.cookies[sid]];
    if (user_id == undefined) {
        response.setHeader("Content-Type", "text/html");
        response.status(ServerNotFound);
        response.send('Bad session id')
        response.end()
        return
    }
    const result = service.isAdmin(user_id);
    response.setHeader("Content-Type", "text/html");
    response.status(OK)
    response.send(result)
    response.end();
})
router.get('/is/owner', (request: any, response: any) => {
    const user_id = Session.sessions[request.cookies[sid]];
    if (user_id == undefined) {
        response.status(ServerNotFound);
        response.send('Bad session id')
        response.end()
        return
    }
    const result = service.isOwner(user_id);
    response.setHeader("Content-Type", "text/html");
    response.status(OK)
    response.send(result)
    response.end();
})
router.get('/is/manager', (request: any, response: any) => {
    const user_id = Session.sessions[request.cookies[sid]];
    if (user_id == undefined) {
        response.status(ServerNotFound);
        response.send('Bad session id')
        response.end()
        return
    }
    const result = service.isManager(user_id);
    response.setHeader("Content-Type", "text/html");
    response.status(OK)
    response.send(result)
    response.end();
})