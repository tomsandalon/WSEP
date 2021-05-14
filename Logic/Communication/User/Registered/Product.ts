import {assign_manager, assign_owner, route_shop_manage_product, service, Session, sid} from "../../Config/Config";
const express = require('express');
const router = express.Router();
module.exports = router;

router.delete('/', (request: any, response: any) => {
    const user_id = Session.sessions[request.cookies[sid]];
    if (user_id == undefined) {
        response.status(404);
        response.send('Bad session id')
        response.end()
        return
    }
    const result = service.removeProduct(user_id, request.body.shop_id, request.body.product_id);
    response.setHeader("Content-Type", "text/html");
    if (typeof result === 'string') {
        response.status(400);
        response.send(result.toString());
    } else {
        response.status(200);
    }
    response.end();
})

router.put('/', (request: any, response: any) => {
    const user_id = Session.sessions[request.cookies[sid]];
    if (user_id == undefined) {
        response.status(404);
        response.send('Bad session id')
        response.end()
        return
    }
    const result = service.editProduct(
        user_id,
        request.body.shop_id,
        request.body.product_id,
        request.body.action,
        request.body.value
    );
    response.setHeader("Content-Type", "text/html");
    if (typeof result === 'string') {
        response.status(400);
        response.send(result.toString());
    } else {
        response.status(200);
    }
    response.end();
})

router.post('/', (request: any, response: any) => {
    const user_id = Session.sessions[request.cookies[sid]];
    if (user_id == undefined) {
        response.status(404);
        response.send('Bad session id')
        response.end()
        return
    }
    const result = service.addProduct(
        user_id,
        request.body.shop_id,
        request.body.name,
        request.body.description,
        request.body.amount,
        request.body.categories,
        request.body.base_price,
        );
    if (typeof result === 'string') {
        response.status(400);
        response.setHeader("Content-Type", "text/html");
        response.send(result);
    } else {
        response.status(200);
        response.end();
    }
})