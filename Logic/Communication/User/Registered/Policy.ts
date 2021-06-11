import {
    assign_manager,
    assign_owner, BadRequest, OK,
    ServerNotFound,
    service, ServiceUnavailable,
    Session,
    sid, Unauthorized
} from "../../Config/Config";
import {route_shop_manage_product} from "../../Routes";
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
    if (!service.isAvailable()){
        response.status(ServiceUnavailable);
        response.end();
        return;
    }
    const user_id = session_data.user_id;
    const result = service.getAllPurchasePolicies(user_id, request.query.shop_id)
    if (typeof result === 'string') {
        response.status(Unauthorized);
        response.setHeader("Content-Type", "text/html");
        response.send(result.toString());
    } else {
        response.status(OK);
        response.setHeader("Content-Type", "application/json");
        response.json(result);
    }
    response.end();
})
router.delete('/', (request: any, response: any) => {
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
    const result = service.removePurchasePolicy(user_id, request.body.shop_id, request.body.policy_id);
    response.setHeader("Content-Type", "text/html");
    if (typeof result === 'string') {
        response.status(Unauthorized);
        response.send(result.toString());
    } else {
        response.status(OK);
    }
    response.end();
})

router.put('/', (request: any, response: any) => {
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
    const result = service.composePurchasePolicy(
        user_id,
        request.body.shop_id,
        request.body.policy_id_first,
        request.body.policy_id_second,
        request.body.operator,
    );
    response.setHeader("Content-Type", "text/html");
    if (typeof result === 'string') {
        response.status(Unauthorized);
        response.send(result.toString());
    } else {
        response.status(OK);
    }
    response.end();
})

router.post('/', (request: any, response: any) => {
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
    const result = service.addPurchasePolicy(user_id, request.body.shop_id, request.body.condition, request.body.value);
    if (typeof result === 'string') {
        response.status(Unauthorized);
        response.setHeader("Content-Type", "text/html");
        response.send(result.toString());
    } else {
        response.status(OK);
        response.setHeader("Content-Type", "application/json");
        response.json(result);
    }
    response.end();
})