import {service, Session, sid} from "../Config/Config";
import {request} from "express";
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
    const result = service.userOrderHistory(user_id);
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
        return;
    }
    const result = service.purchaseShoppingBasket(user_id, request.body.shop_id, request.body.payment);
    if (typeof result === 'string') {
        response.status(400);
        response.setHeader("Content-Type", "text/html");
        response.send(result);
    } else {
        response.status(200);
        response.end();
    }
})

router.post('/all', (request: any, response: any) => {
    const user_id = Session.sessions[request.cookies[sid]];
    if (user_id == undefined) {
        response.status(404);
        response.send('Bad session id')
        response.end()
        return;
    }
    const result = service.purchaseCart(user_id, request.body.payment);
    if (typeof result === 'string') {
        response.status(400);
        response.setHeader("Content-Type", "text/html");
        response.send(result);
    } else {
        response.status(200);
        response.end();
    }
})
