import {Notification} from "./Notification";
import {Publisher} from "./Publisher";
import {logger} from "../Logger";
// import * as P from "../../Service/Publisher"
import {LoginImpl} from "../Users/Login";
import {ClearNotifications, Notify} from "../../DataAccess/API";
import {SystemImpl} from "../System";

let P: any

export class PublisherImpl implements Publisher {
    private static instance: PublisherImpl;
    private static id_counter = 0;
    notificationQueue: { [user_id: number]: Notification[] };

    private constructor() {
        this.notificationQueue = {};
    }

    disconnectAllUsers() {
        P.Publisher.getInstance().disconnectAllUsers()
    }
    reconnectAllUsers() {
        P.Publisher.getInstance().reconnectAllUsers()
    }

    public static getInstance(reset?: boolean): PublisherImpl {
        if (PublisherImpl.instance == undefined || reset) {
            PublisherImpl.instance = new PublisherImpl();
        }
        return PublisherImpl.instance;
    }



    static terminateAllConnections() {

    }

    fetchNotifications(user_id: number): Notification[] {
        const result = this.getNotifications(user_id);
        this.removeNotifications(user_id);
        return result;
    }

    notifyFlush(user_id: number): boolean {
        if (P != undefined) {
            if (LoginImpl.getInstance().isLoggedIn(user_id)) {
                P.Publisher.getInstance().notify(user_id, this.notificationQueue[user_id].length)
                return true;
            }
        } else logger.Error(`Failed to send notifications to ${user_id} as the publisher is not defined`)
        return false
    }

    getAmountOfNotifications(user_id: number): number {
        if (user_id in this.notificationQueue) {
            return this.notificationQueue[user_id].length
        } else return -1;
    }

    notify(user_id: number, notification: Notification): void {
        if (user_id in this.notificationQueue) {
            this.notificationQueue[user_id].push(notification)
        } else {
            this.notificationQueue[user_id] = [notification]
        }
        if (!this.notifyFlush(user_id)) {
            Notify([
                {user_id: user_id, notification: notification.message, notification_id: PublisherImpl.id_counter++}
            ]).then((r: any) => r ? {} : SystemImpl.rollback)
        }
    }

    getNotifications(user_id: number): Notification[] {
        const result = this.notificationQueue[user_id];
        return result == undefined ? [] : result;
    }

    removeNotifications(user_id: number): void {
        this.notificationQueue[user_id] = [];
        ClearNotifications(user_id).then(r => r ? {} : SystemImpl.rollback())
    }

    removeAllNotifications(): void {
        this.notificationQueue = {}
    }

    fetchAllNotifications(): { user_id: number; notifications: Notification[] }[] {
        return [];
    }

    notifyAll(user_id: number, notifications: Notification[]): void {
        const [head, ...rest] = notifications;
        this.notify(user_id, head);
        this.notificationQueue[user_id].push(...rest);
    }

    notifyThem(collection: { [p: number]: Notification }): void {
        // collection.ent
        // for(const [key, value] of collection){
        //
        // }
    }

    notifyThemAll(collection: { [p: number]: Notification[] }): void {
    }

    hasNotifications(user_id: number): boolean {
        const entry = this.notificationQueue[user_id];
        return entry !== undefined && entry.length !== 0;
    }

    addNotificationsFromDB(notifications) {
        notifications.forEach(notification => {
            const newNotification = new Notification(notification.notification)
            this.notificationQueue[notification.user_id] = this.notificationQueue[notification.user_id] ?
                this.notificationQueue[notification.user_id].concat([newNotification]) :
                [newNotification]
            PublisherImpl.id_counter = Math.max(PublisherImpl.id_counter, notification.notification_id + 1)
        })
    }
}
