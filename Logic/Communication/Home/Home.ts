import {service, sid, Session} from "../Config/Config";

const express = require('express');
const router = express.Router();
module.exports = router;

router.get('/', async (req: any, res: any) => {
    const session_id = Session.session_id_specifier++;
    Session.sessions[session_id] = service.openSession();
    const result = 10
    // const result = await promisedFib(req.params.num);
    res.status(200);
    res.cookie(sid, session_id, {})
    res.send(`My first server!\n${result}\n:D`)
})