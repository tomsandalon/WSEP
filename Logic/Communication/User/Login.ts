import {service, sid} from "../Config/Config";
const express = require('express');
const router = express.Router();
module.exports = router;
router.get('/', (req: any, res: any) => {
    //TODO give html to client
    res.send("My first server!\n" + req.url + "\n:D")
})
router.put('/', (req: any, res: any) => {
    //TODO perform logout
    res.send("My first server!\n" + req.url + "\n:D")
})

router.post('/', (req: any, res: any) => {
    let user_id = parseInt(req.cookies[sid]);
    if (isNaN(user_id)) {
        res.status(404);
        res.send('Bad session id')
    } else {
        const result = service.performLogin(req.body.username, req.body.password);
        if (typeof result === 'string') {
            res.status(200);
            res.send(result)
        } else {
            res.status(200);
            //TODO give html home page
            res.send("Welcome!\n")
        }
    }
})