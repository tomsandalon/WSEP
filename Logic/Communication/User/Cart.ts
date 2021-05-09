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
    }
    response.setHeader("Content-Type", "application/json");
    response.send(service.displayShoppingCart(user_id))
    response.end();
})
router.put('/', (req: any, res: any) => {
    //TODO perform logout
    res.send("My first server!\n" + req.url + "\n:D")
})

router.post('/', (request: any, response: any) => {
    const user_id = Session.sessions[request.cookies[sid]];
    if (user_id == undefined) {
        response.status(404);
        response.send('Bad session id')
        response.end()
        return;
    }
    const result = service.addItemToBasket(user_id, request.body.product_id, request.body.shop_id, request.body.amount);
    if (typeof result === 'string') {
        response.status(400);
        response.setHeader("Content-Type", "text/html");
        response.send(result);
    } else {
        response.status(200);
        response.end();
    }
})

router.put('/', (request: any, response: any) => {
    const user_id = Session.sessions[request.cookies[sid]];
    if (user_id == undefined) {
        response.status(404);
        response.send('Bad session id')
        response.end()
    }
    const result = service.editShoppingCart(user_id, request.body.shop_id, request.body.product_id, request.body.amount);
    console.log(result);
    if (typeof result === 'string') {
        response.status(400);
        response.setHeader("Content-Type", "text/html");
        response.send(result);
    } else {
        response.status(200);
        response.end();
    }
})

router.delete('/', (request: any, response: any) => {
    const user_id = Session.sessions[request.cookies[sid]];
    if (user_id == undefined) {
        response.status(404);
        response.send('Bad session id')
        response.end()
    }
    const result = service.removeItemFromBasket(user_id, request.body.shop_id, request.body.product_id);
    console.log(result);
    if (typeof result === 'string') {
        response.status(400);
        response.setHeader("Content-Type", "text/html");
        response.send(result);
    } else {
        response.status(200);
        response.end();
    }
})