import {service, sid} from "../Config/Config";
const express = require('express');
const router = express.Router();
module.exports = router;
router.get('/', (req: any, res: any) => {
    //TODO give html to client
    res.send("My first server!\n" + req.url + "\n:D")
})
router.post('/', (req: any, response: any) => {
    let user_id = parseInt(req.cookies[sid]);
    const content_type = "application/json";
    if (isNaN(user_id)) {
        response.status(404);
        response.send('Bad session id')
    } else {
        const result = service.performRegister(req.body.email, req.body.password);
        console.log(req.body.email, req.body.password)
        response.setHeader("Content-Type", content_type);
        if (result) {
            response.status(200);
        } else {
            response.status(400);
        }
        response.end();
    }
})