import {service, Session, sid_regex} from "../Config/Config";
import {acknowledge_for_notifications, get_notifications, hello, send_notifications} from "../WSEvents";

export const configWebSocket = (io: any) =>
    io.on('connection', (socket: any) => {
        socket.on(hello, (hello_message: any) => {
            if (sid_regex.test(hello_message)) {
                const sid = parseInt(hello_message.split('=')[1]);
                Session.sessions[sid].socket = socket;
                const user_id = Session.sessions[sid].user_id;
                // console.log("FirstTime connection",hello);
                if (service.isLoggedIn(user_id) && Session.publisher.hasNotifications(user_id)) {
                    // console.log("Sending first time acknowledge_for_notifications");
                    socket.emit(acknowledge_for_notifications, true)
                }
             }
            else {
                socket.close()
            }
        })
        socket.on(send_notifications, (message: any) => {
            if (sid_regex.test(message)) {
                const sid = parseInt(message.split('=')[1]);
                const entry = Session.sessions[sid];
                if (entry !== undefined && entry.socket === socket) {
                    const notifications = Session.publisher.fetch(entry.user_id);
                    console.log("Notifications:",notifications);
                    socket.emit(get_notifications, notifications)
                }
            }
        })
    })
export const notify = (user_id: number) => {
    for (let sid in Session.sessions) {
        const entry = Session.sessions[sid]
        if (entry !== undefined && entry.user_id == user_id) {
            entry.socket.emit(acknowledge_for_notifications, true)
            return;
        }
    }
}