import {PublisherImpl} from "./PublisherImpl";
import {Notification} from "./Notification";
import {LoginImpl} from "../Users/Login";
import {logger} from "../Logger";

export class NotificationAdapter {
    // notificationPool: Publisher
    // login: Login
    private static instance: NotificationAdapter

    private constructor(reset?: boolean) {
        // this.notificationPool = PublisherImpl.getInstance()
    }

    static getInstance(reset?: boolean): NotificationAdapter {
        if (NotificationAdapter.instance == null || reset) {
            NotificationAdapter.instance = new NotificationAdapter(reset)
        }
        return NotificationAdapter.instance
    }

    notify(user_email: string, notification: string): void {
        const new_notification = new Notification(notification)
        const user_id = LoginImpl.getInstance().getUserId(user_email);
        if (user_id != undefined) {
            PublisherImpl.getInstance().notify(user_id, new_notification)
        } else logger.Error(`Failed to send message ${notification} to ${user_email}`)
    }

    notifyForUserId(user_id: number, notification: string): void {
        const new_notification = new Notification(notification)
        PublisherImpl.getInstance().notify(user_id, new_notification)
    }

    removeOfferNotificationsOfOffer(offer_id: number) {
        return PublisherImpl.getInstance().removeNotificationsOfOffer(offer_id)
    }
}