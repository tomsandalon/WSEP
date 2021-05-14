import {route_shop, service, Session, shop_purchase_history, sid} from "../../Config/Config";
const express = require('express');
const router = express.Router();
module.exports = router;
router.get('/', (request: any, response: any) => {
    const user_id = Session.sessions[request.cookies[sid]];
    if (user_id == undefined) {
        response.status(404);
        response.send('Bad session id')
        response.end()
        return
    }
    const result = service.getItemsFromShop(request.body.shop_id);
    if(typeof result == "string") {
        response.status(400);
        response.setHeader("Content-Type", "text/html");
        response.send(result);
        response.end()
        return;
    }
    else{
        response.setHeader("Content-Type", "application/json");
        response.status(200);
        response.send(result)
        response.end();
        return;
    }
})

router.get(shop_purchase_history, (request: any, response: any) => {
    const user_id = Session.sessions[request.cookies[sid]];
    if (user_id == undefined) {
        response.status(404);
        response.send('Bad session id')
        response.end()
        return
    }
    const result = service.shopOrderHistory(user_id, request.body.shop_id);
    if(typeof result == "string") {
        response.status(400);
        response.setHeader("Content-Type", "text/html");
        response.send(result);
        response.end()
        return;
    }
    else{
        response.setHeader("Content-Type", "application/json");
        response.status(200);
        response.send(result)
        response.end();
        return;
    }
})

router.post('/', (request: any, response: any) => {
    const user_id = Session.sessions[request.cookies[sid]];
    if (user_id == undefined) {
        response.status(404);
        response.send('Bad session id')
        response.end()
        return
    }
    const result = service.addShop(user_id, request.body.name, request.body.description, request.body.location, request.body.bank_info);
    response.setHeader("Content-Type", "text/html");
    if (typeof result === 'string') {
        response.status(400);
    } else {
        response.status(200);
    }
    response.send(result.toString());
    response.end();
})