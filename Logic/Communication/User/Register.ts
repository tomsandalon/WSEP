import {service, sid} from "../Config/Config";
const express = require('express');
const router = express.Router();
module.exports = router;
router.get('/', (req: any, res: any) => {
    //TODO give html to client
    res.send("My first server!\n" + req.url + "\n:D")
})
router.post('/', (req: any, res: any) => {
    console.log("Registering");
    let user_id = parseInt(req.cookies[sid]);
    if (isNaN(user_id)) {
        res.status(404);
        res.send('Bad session id')
    } else {
        const result = service.performRegister(req.body.email, req.body.password);
        console.log(result);
        res.status(200);
        if (result) {
            //TODO give html home page
            res.status(200);
        } else {
            res.status(401);
        }
    }
})