import {
    BadRequest, offer,
    OK,
    purchase_cart,
    ServerNotFound,
    service,
    ServiceUnavailable,
    Session, shop_offer,
    sid, user_offer
} from "../../Config/Config";
import {request, response} from "express";
const express = require('express');
const router = express.Router();
module.exports = router;

router.get(user_offer, (request: any, response: any) => {
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
    const result = service.getActiveOffersAsUser(user_id);
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

router.post(user_offer, (request: any, response: any) => {
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
    const result = service.makeOffer(user_id, request.body.shop_id, request.body.product_id, request.body.amount, request.body.price_per_unit);
    if (typeof result === 'string') {
        response.status(BadRequest);
        response.setHeader("Content-Type", "text/html");
        response.send(result);
        response.end()
    } else {
        // console.log("Offer accepted");
        response.status(OK);
        response.end();
    }
})

router.put(user_offer, (request: any, response: any) => {
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
    let result;
    switch (request.body.action) {
        case 'Deny':
            result = service.denyCounterOfferAsUser(user_id, request.body.offer_id);
            break;
        case 'Counter':
            result = service.counterOfferAsUser(user_id, request.body.shop_id, request.body.offer_id, request.body.new_price_per_unit);
            break;
        default:
            result = 'Bad action on offer as user';
    }
    if (typeof result === 'string') {
        // console.log("Deny offer failed");
        response.status(BadRequest);
        response.setHeader("Content-Type", "text/html");
        response.send(result);
    } else {
        // console.log("Deny offer success");
        response.status(OK);
        response.end();
    }
})

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
    const result = service.offerIsPurchasable(user_id, request.query.shop_id, request.query.offer_id);
    if (typeof result === 'string') {
        response.status(BadRequest);
    } else {
        response.status(OK);
    }
    response.setHeader("Content-Type", "text/html");
    response.send(result);
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
    const result = await service.purchaseOffer(user_id, request.body.offer_id, JSON.stringify(request.body.payment));
    if (typeof result === 'string') {
        response.status(BadRequest);
        response.setHeader("Content-Type", "text/html");
        response.send(result);
    } else {
        response.status(OK);
        response.end();
    }
})

router.get(shop_offer, (request: any, response: any) => {
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
    const result = service.getActiveOfferForShop(user_id, request.query.shop_id);
    if (typeof result === 'string') {
        response.status(BadRequest);
        response.setHeader("Content-Type", "text/html");
        response.send(result);
    } else {
        response.setHeader("Content-Type", "application/json");
        response.status(OK);
        response.send(result)
        response.end();
    }
})

router.post(shop_offer, (request: any, response: any) => {
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
    let result;
    switch (request.body.action) {
        case 'Accept':
            result = service.acceptOfferAsManagement(user_id, request.body.shop_id, request.body.offer_id);
            break;
        case 'Deny':
            result = service.denyOfferAsManagement(user_id, request.body.shop_id, request.body.offer_id);
            break;
        case 'Counter':
            result = service.counterOfferAsManager(user_id, request.body.shop_id, request.body.offer_id, request.body.new_price_per_unit);
            break;
        default:
            result = 'Bad Action'
    }
    if (typeof result === 'string') {
        response.status(BadRequest);
        response.setHeader("Content-Type", "text/html");
        response.send(result);
    } else {
        response.status(OK);
        response.end();
    }
})

