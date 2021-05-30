import {Publisher} from "./Publisher";
import {PublisherImpl} from "./PublisherImpl";
import {Notification} from "./Notification";
import {Login, LoginImpl} from "../Users/Login";
import {pool} from "async-parallel";
import {logger} from "../Logger";

export class NotificationAdapter {
    // notificationPool: Publisher
    // login: Login
    private static instance: NotificationAdapter

    static getInstance(reset?: boolean): NotificationAdapter {
        if (NotificationAdapter.instance == null || reset) {
            NotificationAdapter.instance = new NotificationAdapter(reset)
        }
        return NotificationAdapter.instance
    }

    private constructor(reset?: boolean) {
        // this.notificationPool = PublisherImpl.getInstance()
    }

    notify(user_email: string, notification: string): void {
        const new_notification = new Notification(notification)
        const user_id = LoginImpl.getInstance().getUserId(user_email);
        if (user_id != undefined) {
            PublisherImpl.getInstance().notify(user_id, new_notification)
        }
        else logger.Error(`Failed to send message ${notification} to ${user_email}`)
    }
}