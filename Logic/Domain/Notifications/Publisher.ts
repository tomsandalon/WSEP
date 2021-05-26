import {Notification} from "./Notification";

export interface Publisher {
    notify(user_id: number, notification: Notification): void;
    notifyFlush(user_id: number): void;
    notifyAll(user_id: number, notifications: Notification[]): void;
    notifyThem(collection: {[userid: number]: Notification}): void;
    notifyThemAll(collection: {[userid: number]: Notification[]}): void;
    fetchNotifications(user_id: number): Notification[];
    fetchAllNotifications(): {user_id: number, notifications: Notification[]}[]
    hasNotifications(user_id: number): boolean
}
