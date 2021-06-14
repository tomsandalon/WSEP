import {
    BadRequest, categories, OK, purchase_type,
    ServerNotFound,
    service, ServiceUnavailable,
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
    if (!service.isAvailable()){
        response.status(ServiceUnavailable);
        response.end();
        return;
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
    if (!service.isAvailable()){
        response.status(ServiceUnavailable);
        response.end();
        return;
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
    if (!service.isAvailable()){
        response.status(ServiceUnavailable);
        response.end();
        return;
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
    if (!service.isAvailable()){
        response.status(ServiceUnavailable);
        response.end();
        return;
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

router.post(purchase_type, (request: any, response: any) => {
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
    if(request.body.purchase_type == 0 || request.body.purchase_type == 1){
        result = service.addPurchaseType(user_id, request.body.shop_id, request.body.purchase_type);
    } else {
        result = 'bad purchase_type'
    }
    response.setHeader("Content-Type", "text/html");
    if(typeof result == "string") {
        response.status(BadRequest);
        response.send(result);
    }
    else{
        response.status(OK);
    }
    response.end();
})

router.delete(purchase_type, (request: any, response: any) => {
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
    if(request.body.purchase_type == 0 || request.body.purchase_type == 1){
        result = service.removePurchaseType(user_id, request.body.shop_id, request.body.purchase_type);
    } else {
        result = 'bad purchase_type'
    }
    response.setHeader("Content-Type", "text/html");
    if(typeof result == "string") {
        response.status(BadRequest);
        response.send(result);
    }
    else{
        response.status(OK);
    }
    response.end();
})

router.get(purchase_type, (request: any, response: any) => {
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
    let result = service.getPurchaseTypes(user_id, request.query.shop_id);
    if(typeof result == "string") {
        response.setHeader("Content-Type", "text/html");
        response.status(BadRequest);
        response.send(result);
    }
    else{
        response.setHeader("Content-Type", "application/json");
        response.status(OK);
        response.send(result);
    }
    response.end();
})
