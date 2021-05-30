import {
    BadRequest,
    details,
    isAdmin, isLoggedIn,
    isManager, isOwner,
    OK,
    permissions,
    ServerNotFound,
    service,
    Session,
    sid,
    Unauthorized
} from "../../Config/Config";
const express = require('express');
const router = express.Router();
module.exports = router;
router.get('/', (request: any, response: any) => {
    const session_data = Session.sessions[request.cookies[sid]];
    if (session_data == undefined) {
        response.status(ServerNotFound);
        response.send('Bad session id')
        response.end()
        return
    }
    const user_id = session_data.user_id;
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
router.get(permissions, (request: any, response: any) => {
    const session_data = Session.sessions[request.cookies[sid]];
    if (session_data == undefined) {
        response.status(ServerNotFound);
        response.send('Bad session id')
        response.end()
        return
    }
    const user_id = session_data.user_id;
    const result = service.getPermissions(user_id, request.query.shop_id);
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
router.get(isLoggedIn, (request: any, response: any) => {
    const session_data = Session.sessions[request.cookies[sid]];
    if (session_data == undefined) {
        response.status(ServerNotFound);
        response.send('Bad session id')
        response.end()
        return
    }
    const user_id = session_data.user_id;
    const result = service.isLoggedIn(user_id);
    response.setHeader("Content-Type", "text/html");
    response.status(OK)
    response.send(result)
    response.end();
})
router.get(isAdmin, (request: any, response: any) => {
    const session_data = Session.sessions[request.cookies[sid]];
    if (session_data == undefined) {
        response.status(ServerNotFound);
        response.send('Bad session id')
        response.end()
        return
    }
    const user_id = session_data.user_id;
    const result = service.isAdmin(user_id);
    response.setHeader("Content-Type", "text/html");
    response.status(OK)
    response.send(result)
    response.end();
})
router.get(isOwner, (request: any, response: any) => {
    const session_data = Session.sessions[request.cookies[sid]];
    if (session_data == undefined) {
        response.status(ServerNotFound);
        response.send('Bad session id')
        response.end()
        return
    }
    const user_id = session_data.user_id;
    const result = service.isOwner(user_id);
    response.setHeader("Content-Type", "text/html");
    response.status(OK)
    response.send(result)
    response.end();
})
router.get(isManager, (request: any, response: any) => {
    const session_data = Session.sessions[request.cookies[sid]];
    if (session_data == undefined) {
        response.status(ServerNotFound);
        response.send('Bad session id')
        response.end()
        return
    }
    const user_id = session_data.user_id;
    const result = service.isManager(user_id);
    response.setHeader("Content-Type", "text/html");
    response.status(OK)
    response.send(result)
    response.end();
})

router.get(details, (request: any, response: any) => {
    const session_data = Session.sessions[request.cookies[sid]];
    if (session_data == undefined) {
        response.status(ServerNotFound);
        response.send('Bad session id')
        response.end()
        return
    }
    const user_id = session_data.user_id;
    const result = service.getUserEmailFromUserId(user_id);
    response.setHeader("Content-Type", "text/html");
    if (typeof result == "string"){
        response.status(BadRequest)
        response.send(result)
    } else {
        response.status(OK)
        response.send(result[0])
    }
    response.end();
})