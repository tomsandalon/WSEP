import {
    assign_manager,
    assign_owner,
    BadRequest, OK,
    permissions,
    ServerNotFound,
    service, ServiceUnavailable,
    Session,
    sid
} from "../../Config/Config";
const express = require('express');
const router = express.Router();
module.exports = router;

router.post(assign_manager, (request: any, response: any) => {
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
    const result = service.appointManager(user_id, request.body.shop_id, request.body.email);
    if (typeof result === 'string') {
        response.status(BadRequest);
        response.setHeader("Content-Type", "text/html");
        response.send(result);
    } else {
        response.status(OK);
        response.end();
    }
})

router.post(assign_owner, (request: any, response: any) => {
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
    const result = service.appointOwner(user_id, request.body.shop_id, request.body.email);
    if (typeof result === 'string') {
        response.status(BadRequest);
        response.setHeader("Content-Type", "text/html");
        response.send(result);
    } else {
        response.status(OK);
        response.end();
    }
})

router.delete(assign_manager, (request: any, response: any) => {
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
    const result = service.removeManager(user_id, request.body.shop_id, request.body.target);
    if (typeof result === 'string') {
        response.status(BadRequest);
        response.setHeader("Content-Type", "text/html");
        response.send(result);
    } else {
        response.status(OK);
        response.end();
    }
})

router.delete(assign_owner, (request: any, response: any) => {
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
    const result = service.removeOwner(user_id, request.body.shop_id, request.body.target);
    if (typeof result === 'string') {
        response.status(BadRequest);
        response.setHeader("Content-Type", "text/html");
        response.send(result);
    } else {
        response.status(OK);
        response.end();
    }
})

router.post(assign_manager + permissions, (request: any, response: any) => {
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
    const result = service.addPermissions(user_id, request.body.shop_id, request.body.target, request.body.action);
    if (typeof result === 'string') {
        response.status(BadRequest);
        response.setHeader("Content-Type", "text/html");
        response.send(result);
    } else {
        response.status(OK);
        response.end();
    }
})

router.put(assign_manager + permissions, (request: any, response: any) => {
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
    const result = service.editPermissions(user_id, request.body.shop_id, request.body.target, request.body.actions);
    if (typeof result === 'string') {
        response.status(BadRequest);
        response.setHeader("Content-Type", "text/html");
        response.send(result);
    } else {
        response.status(OK);
        response.end();
    }
})


router.delete(assign_manager + permissions, (request: any, response: any) => {
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
    const result = ''
    //TODO once implemented uncomment

    // const result = service.removePermission(user_id, request.body.shop_id, request.body.target, request.body.action);
    if (typeof result === 'string') {
        response.status(BadRequest);
        response.setHeader("Content-Type", "text/html");
        response.send(result);
    } else {
        response.status(OK);
        response.end();
    }
})