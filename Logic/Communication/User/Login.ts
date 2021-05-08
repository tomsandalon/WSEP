import {service, Session, sid} from "../Config/Config";
const express = require('express');
const router = express.Router();
module.exports = router;
router.get('/', (req: any, response: any) => {
    console.log("Connection Login")
    const session_id = Session.session_id_specifier++;
    const lior_result = service.openSession();
    Session.sessions[session_id] = lior_result;
    response.status(200);
    // const contentType = 'text/html';
    const contentType = '';
    response.setHeader("Content-Type", "application/json");
    // response.set('Content-Type', contentType);
    response.cookie(sid, session_id, {})
    response.json({
        "name": "animals",
        "animals": [
            "Dog",
            "Cat",
            "Mouse",
            "Pig",
            "Bear"
        ],
        "hobbies": {
            "football": false,
            "reading": true
        }
    });
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