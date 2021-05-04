import {service, sid} from "../Config/Config";
const express = require('express');
const router = express.Router();
module.exports = router;
router.get('/register', (req: any, res: any) => {
    //TODO give html to client
    res.send("My first server!\n" + req.url + "\n:D")
})
router.post('/register', (req: any, res: any) => {
    let user_id = parseInt(req.cookies[sid]);
    if (isNaN(user_id)) {
        res.status(404);
        res.send('Bad session id')
    } else {
        const result = service.performRegister(req.body.user, req.body.password);
        res.status(200);
        if (result) {
            //TODO give html home page
            res.send("Welcome!\n")
        } else {
            res.send(result)
        }
    }
})