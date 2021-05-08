import {service, Session, sid} from "../Config/Config";
const express = require('express');
const router = express.Router();
module.exports = router;
router.get('/', (request: any, response: any) => {
    const sid = request.cookies['SID'];
    console.log(sid);
    response.end();
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
        const result = service.performLogin(req.body.email, req.body.password);
        res.setHeader("Content-Type", "text/html");
        if (typeof result === 'string') {
            res.status(401);
            res.send(result);
        } else {
            res.status(200);
            res.end();
        }
    }
})