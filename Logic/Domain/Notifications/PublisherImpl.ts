import { Notification } from "./Notification";
import {Publisher} from "./Publisher";
import * as P from  '../../Service/Publisher';
export class PublisherImpl implements Publisher{
    private static instance: PublisherImpl;
    private readonly notificationQueue: {[user_id: number]: Notification[]};
    private constructor() {
        this.notificationQueue = {};
    }

    public static getInstance(): PublisherImpl{
        if(PublisherImpl.instance == undefined){
            PublisherImpl.instance = new PublisherImpl();
        }
        return PublisherImpl.instance;
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
        P.Publisher.getInstance().notify(user_id)
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