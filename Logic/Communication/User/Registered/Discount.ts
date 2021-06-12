import {
    assign_manager,
    assign_owner, BadRequest, OK,
    ServerNotFound,
    service,
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
    const user_id = session_data.user_id;
    const result = service.getAllDiscounts(user_id, request.query.shop_id)
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
    const user_id = session_data.user_id;
    const result = service.removeDiscount(user_id, request.body.shop_id, request.body.id);
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
    const user_id = session_data.user_id;
    let result;
    switch (request.body.request){
        case 1:
            result = service.addDiscount(user_id,  request.body.shop_id, request.body.value);
            break;
        case 2:
            result = service.addConditionToDiscount(user_id, request.body.shop_id, request.body.id, request.body.condition, request.body.condition_param);
            break;
        case 3:
            result = service.addNumericComposeDiscount(user_id, request.body.shop_id, request.body.operation, request.body.discount_id_one, request.body.discount_id_two);
            break;
        case 4:
            result = service.addLogicComposeDiscount(user_id, request.body.shop_id, request.body.operation, request.body.discount_id_one, request.body.discount_id_two);
            break;
        default:
            result = 'bad request'
    }
    if (result == 'bad request'){
        response.status(BadRequest);
        response.setHeader("Content-Type", "text/html");
        response.send(result.toString());
    } else if (typeof result === 'string') {
        response.status(Unauthorized);
        response.setHeader("Content-Type", "text/html");
        response.send(result.toString());
    } else {
        response.status(OK);
    }
    response.end();
})