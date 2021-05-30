import * as P from "../Domain/Notifications/Publisher";
import {PublisherImpl} from "../Domain/Notifications/PublisherImpl";
import {notify} from "../Communication/User/Notification";
import {Notification} from "../Domain/Notifications/Notification";

export class Publisher {
    private static instance: Publisher
    private _publisher_domain: P.Publisher | null
    private constructor() {
        this._publisher_domain = null;
    }
    public static getInstance(){
        if (this.instance == undefined){
            this.instance = new Publisher()
            this.instance._publisher_domain = PublisherImpl.getInstance()
        }
        return this.instance
    }

    public fetch(user_id: number): string[]{
        return this._publisher_domain == null ? [''] : this._publisher_domain.fetchNotifications(user_id).map((notification: Notification) => notification.message);
    }
    public notify(user_id: number, amount: number){
        notify(user_id, amount)
    }

    public hasNotifications(user_id: number): boolean {
        if (this._publisher_domain == null){
            return false
        }
        // return user_id == 4 || user_id == 6
        return this._publisher_domain.hasNotifications(user_id);
    }

    public getAmountOfNotifications(user_id: number): number {
        if (this._publisher_domain == null){
            return -1
        }
        return this._publisher_domain.getAmountOfNotifications(user_id);
    }
}