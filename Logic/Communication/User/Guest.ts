import {service, Session, sid, sid_regex} from "../Config/Config";
import {hour} from "../Config/Config";
import {io} from "../Server";
const express = require('express');
const router = express.Router();
module.exports = router;
router.get('/',(request: any, response: any) => {
    const user_id = Session.sessions[request.cookies[sid]].user_id;
    let session_id = request.cookies[sid];
    response.status(200);
    response.setHeader("Content-Type", "application/json");
    if (user_id == undefined) {
        session_id = Session.session_id_specifier++;
        Session.sessions[session_id] = {
            user_id: service.openSession(),
            socket: null
        };
    }
    response.cookie(sid, session_id, {})
    response.end();
})

io.on('connection', (socket: any) =>{
    socket.on('Hello', (hello_message: any) => {
        if (sid_regex.test(hello_message)){
            const sid = parseInt(hello_message.split('=')[1]);
            Session.sessions[sid].socket = socket;
            socket.emit('Pending Notifications', true)
        } else {
            socket.close()
        }
    })
    socket.on('Send Notifications', (message: any) => {
        if (sid_regex.test(message)){
            const sid = parseInt(message.split('=')[1]);
            const entry = Session.sessions[sid];
            if (entry !== undefined && entry.socket === socket){
                const notifications = Session.publisher.fetch(entry.user_id);
                socket.emit('Get Notifications', notifications)
            }
        }
    })
})

export const notify = (user_id: number) => {
    for (let sid in Session.sessions){
        const entry = Session.sessions[sid]
        if(entry !== undefined && entry.user_id == user_id){
            entry.socket.emit('Pending Notifications', true)
        }
    }
}