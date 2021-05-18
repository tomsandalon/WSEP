import {Publisher} from "./Publisher";
import {PublisherImpl} from "./PublisherImpl";
import {Notification} from "./Notification";
import {Login, LoginImpl} from "../Users/Login";
import {pool} from "async-parallel";

export class NotificationAdapter {
    notificationPool: Publisher
    login: Login
    private static instance: NotificationAdapter

    static getInstance(reset?: boolean): NotificationAdapter {
        if (NotificationAdapter.instance == null || reset) {
            NotificationAdapter.instance = new NotificationAdapter(reset)
        }
        return NotificationAdapter.instance
    }

    private constructor(reset?: boolean) {
        this.login = LoginImpl.getInstance()
        this.notificationPool = PublisherImpl.getInstance()
    }

    notify(user_email: string, notification: string): void {
        const new_notification = new Notification(notification)
        const user_id = this.login.getUserId(user_email);
        if (user_id != undefined) this.notificationPool.notify(user_id, new_notification)
    }
}