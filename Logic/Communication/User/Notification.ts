import {service, Session, sid_regex} from "../Config/Config";
import {
    acknowledge_for_notifications,
    get_acknowledge_for_notifications,
    get_notifications,
    hello,
    send_notifications, Service_available, Service_unavailable
} from "../WSEvents";

export const configWebSocket = (io: any) =>
    io.on('connection', (socket: any) => {
        socket.on(hello, (hello_message: any) => {
            if (sid_regex.test(hello_message)) {
                const sid = parseInt(hello_message.split('=')[1]);
                if(Session.sessions[sid] == undefined){
                    console.log('User is unauthorized user is trying to connect\nRejecting...')
                    socket.disconnect()
                    return
                }
                Session.sessions[sid].socket = socket;
                const user_id = Session.sessions[sid].user_id;
                if (service.isLoggedIn(user_id) && Session.publisher.hasNotifications(user_id)) {
                    socket.emit(acknowledge_for_notifications, Session.publisher.getAmountOfNotifications(user_id))
                }
             }
            else {
                socket.disconnect()
            }
        })
        socket.on(send_notifications, (message: any) => {
            if (sid_regex.test(message)) {
                const sid = parseInt(message.split('=')[1]);
                const entry = Session.sessions[sid];
                if (entry !== undefined && entry.socket === socket) {
                    const notifications = Session.publisher.fetch(entry.user_id);
                    socket.emit(get_notifications, notifications)
                }
            }
        })
        socket.on(get_acknowledge_for_notifications, (message: any) => {
            if (sid_regex.test(message)) {
                const sid = parseInt(message.split('=')[1]);
                const entry = Session.sessions[sid];
                if (entry !== undefined && entry.socket === socket) {
                    const amount = Session.publisher.getAmountOfNotifications(entry.user_id);
                    socket.emit(get_acknowledge_for_notifications, amount)
                }
            }
        })
    })
export const notify = (user_id: number, amount: number) => {
    for (let sid in Session.sessions) {
        const entry = Session.sessions[sid]
        if (entry != null && entry.socket != null && entry.user_id == user_id) {
            entry.socket.emit(acknowledge_for_notifications, amount)
            return;
        }
    }
}

export const disconnectAllUsers = () => {
    for (let sid in Session.sessions) {
        const entry = Session.sessions[sid]
        if (entry != null && entry.socket != null) {
            entry.socket.emit(Service_unavailable, true)
        }
    }
}

export const reconnectAllUsers = () => {
    for (let sid in Session.sessions) {
        const entry = Session.sessions[sid]
        if (entry != null && entry.socket != null) {
            entry.socket.emit(Service_available, true)
        }
    }
}