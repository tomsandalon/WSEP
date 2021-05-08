import {service, Session, sid} from "../Config/Config";
const express = require('express');
const router = express.Router();
module.exports = router;
router.get('/', (req: any, response: any) => {

})
router.put('/', (req: any, res: any) => {
    //TODO perform logout
    res.send("My first server!\n" + req.url + "\n:D")
})

router.post('/', (request: any, response: any) => {
    let sid_id = parseInt(request.cookies[sid]);
    if (isNaN(sid_id)) {
        response.status(404);
        response.send('Bad session id')
    } else {
        const user_id_new = service.performLogin(request.body.email, request.body.password);
        response.setHeader("Content-Type", "text/html");
        if (typeof user_id_new === 'string') {
            response.status(401);
            response.send(user_id_new);
        } else {
            Session.sessions[request.cookies[sid]] = user_id_new;
            response.status(200);
            response.end();
        }
    }
})