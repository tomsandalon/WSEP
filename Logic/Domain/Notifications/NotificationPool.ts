import {Notification} from "./Notification";

export interface NotificationPool {
    notify(user_id: number, notification: Notification): void;
    notifyAll(user_id: number, notifications: Notification[]): void;
    notifyThem(collection: {[userid: number]: Notification}): void;
    notifyThemAll(collection: {[userid: number]: Notification[]}): void;
    fetchNotifications(user_id: number): Notification[];
    fetchAllNotifications(): {user_id: number, notifications: Notification[]}[]
}
