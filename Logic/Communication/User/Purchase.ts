import {
    BadRequest,
    OK,
    purchase_cart,
    ServerNotFound,
    service,
    ServiceUnavailable,
    Session,
    sid
} from "../Config/Config";
import {request, response} from "express";
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
    const result = service.userOrderHistory(user_id);
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
        response.send(result)
        response.end();
        return;
    }
})

router.post('/', async (request: any, response: any) => {
    const session_data = Session.sessions[request.cookies[sid]];
    if (session_data == undefined) {
        response.status(ServerNotFound);
        response.send('Bad session id')
        response.end()
        return
    }
    if (!service.isAvailable()) {
        response.status(ServiceUnavailable);
        response.end();
        return;
    }
    const user_id = session_data.user_id;
    console.log("before entering await purchase basket");

    console.log(typeof request.body.shop_id);

    const result = await service.purchaseShoppingBasket(user_id, request.body.shop_id, JSON.stringify(request.body.payment));
    console.log("purchase basket result - ", result);
    if (typeof result === 'string') {
        console.log("purchase error", result);
        response.status(BadRequest);
        response.setHeader("Content-Type", "text/html");
        response.send(result);
        response.end()
    } else {
        console.log("purchase ok", result);
        response.status(OK);
        response.end();
    }
})

router.post(purchase_cart, async (request: any, response: any) => {
    const session_data = Session.sessions[request.cookies[sid]];
    if (session_data == undefined) {
        response.status(ServerNotFound);
        response.send('Bad session id')
        response.end()
        return
    }
    if (!service.isAvailable()) {
        response.status(ServiceUnavailable);
        response.end();
        return;
    }
    const user_id = session_data.user_id;
    const result = await service.purchaseCart(user_id, JSON.stringify(request.body));
    if (typeof result === 'string') {
        response.status(BadRequest);
        response.setHeader("Content-Type", "text/html");
        response.send(result);
    } else {
        response.status(OK);
        response.end();
    }
})
