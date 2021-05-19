import {
    BadRequest, categories, OK,
    ServerNotFound,
    service,
    Session,
    shop_purchase_history,
    sid
} from "../../Config/Config";
import {route_shop} from "../../Routes";
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
    const result = service.getItemsFromShop(request.query.shop_id);
    if(typeof result == "string") {
        response.status(BadRequest);
        response.setHeader("Content-Type", "text/html");
        response.send(result);
        response.end()
        return;
    }
    else{
        response.setHeader("Content-Type", "application/json");
        response.status(OK);
        response.json(result)
        response.end();
        return;
    }
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
    const result = service.addShop(user_id, request.body.name, request.body.description, request.body.location, request.body.bank_info);
    response.setHeader("Content-Type", "text/html");
    if (typeof result === 'string') {
        response.status(BadRequest);
    } else {
        response.status(OK);
    }
    response.send(result.toString());
    response.end();
})

router.get(categories, (request: any, response: any) => {
    const session_data = Session.sessions[request.cookies[sid]];
    if (session_data == undefined) {
        response.status(ServerNotFound);
        response.send('Bad session id')
        response.end()
        return
    }
    const user_id = session_data.user_id;
    const result = service.getAllCategories(user_id);
    if(typeof result == "string") {
        response.status(BadRequest);
        response.setHeader("Content-Type", "text/html");
        response.send(result);
    }
    else{
        response.setHeader("Content-Type", "application/json");
        response.status(OK);
        response.json(result)
    }
    response.end();
})
router.get(shop_purchase_history, (request: any, response: any) => {
    const session_data = Session.sessions[request.cookies[sid]];
    if (session_data == undefined) {
        response.status(ServerNotFound);
        response.send('Bad session id')
        response.end()
        return
    }
    const user_id = session_data.user_id;
    const result = service.shopOrderHistory(user_id, request.query.shop_id);
    if(typeof result == "string") {
        response.status(BadRequest);
        response.setHeader("Content-Type", "text/html");
        response.send(result);
    }
    else{
        response.setHeader("Content-Type", "application/json");
        response.status(OK);
        response.json(result)
    }
    response.end();
})
