import {service, Session, sid} from "../../Config/Config";
const express = require('express');
const router = express.Router();
module.exports = router;
router.get('/history/user', (request: any, response: any) => {
    const user_id = Session.sessions[request.cookies[sid]];
    if (user_id == undefined) {
        response.status(404);
        response.send('Bad session id')
        response.end()
        return
    }
    response.setHeader("Content-Type", "application/json");
    const result = service.adminDisplayUserHistory(user_id, request.body.user_inspect);
    console.log(result)
    response.json(result)
    response.end();
})
router.get('/history/shop', (request: any, response: any) => {
    const user_id = Session.sessions[request.cookies[sid]];
    if (user_id == undefined) {
        response.status(404);
        response.send('Bad session id')
        response.end()
        return
    }
    response.setHeader("Content-Type", "application/json");
    const result = service.adminDisplayShopHistory(user_id, request.body.shop_id);
    console.log(result)
    response.json(result)
    response.end();
})