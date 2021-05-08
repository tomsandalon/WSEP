import {service, Session, sid} from "../Config/Config";
const express = require('express');
const router = express.Router();
module.exports = router;
router.get('/', (request: any, response: any) => {
    const user_id = Session.sessions[request.cookies['SID']];
    response.setHeader("Content-Type", "application/json");
    response.send(service.displayShoppingCart(user_id))
    response.end();
})
router.put('/', (req: any, res: any) => {
    //TODO perform logout
    res.send("My first server!\n" + req.url + "\n:D")
})

router.post('/', (request: any, response: any) => {
    let user_id = parseInt(request.cookies[sid]);
    if (isNaN(user_id)) {
        response.status(404);
        response.send('Bad session id')
    } else {
        const user_id = Session.sessions[request.cookies['SID']];
        const result = service.addItemToBasket(user_id, request.body.product_id, request.body.shop_id, request.body.amount);
        if (typeof result === 'string') {
            response.status(400);
            response.setHeader("Content-Type", "text/html");
            response.send(result);
        } else {
            console.log(`Display cart user_id ${user_id} session id ${request.cookies['SID']}`)
            const cart = service.displayShoppingCart(user_id);
            (cart as string[][]).forEach((basket: any) => {
                console.log("basket")
                basket.forEach((product: string) => {
                    console.log(JSON.parse(product))
                })
            })
            response.status(200);
            response.end();
        }
    }
})