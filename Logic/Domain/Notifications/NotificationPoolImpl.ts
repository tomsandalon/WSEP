import { Notification } from "./Notification";
import {NotificationPool} from "./NotificationPool";

export class NotificationPoolImpl implements NotificationPool{
    private static instance: NotificationPoolImpl;
    private readonly notificationQueue: {[user_id: number]: Notification[]};

    private constructor() {
        this.notificationQueue = {};
    }

    public static getInstance(): NotificationPoolImpl{
        if(NotificationPoolImpl.instance == undefined){
            NotificationPoolImpl.instance = new NotificationPoolImpl();
        }
        return NotificationPoolImpl.instance;
    }

    fetchNotifications(user_id: number): Notification[] {
        const result = this.getNotifications(user_id);
        this.removeNotifications(user_id);
        return result;
    }

    notify(user_id: number, notification: Notification): void {
        if (user_id in this.notificationQueue) {
            this.notificationQueue[user_id].push(notification)
        } else {
            this.notificationQueue[user_id] = [notification]
        }
    }

    getNotifications(user_id: number): Notification[]{
        const result = this.notificationQueue[user_id];
        return result == undefined? []: result;
    }

    removeNotifications(user_id: number): void{
        this.notificationQueue[user_id] = [];
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
}