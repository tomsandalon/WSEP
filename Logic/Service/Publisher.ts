import {notify} from "../Communication/User/Guest";
import * as P from "../Domain/Notifications/Publisher";
import {PublisherImpl} from "../Domain/Notifications/PublisherImpl";

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

    public fetch(user_id: number): string{
        if (this._publisher_domain == null)
            return ''
        return JSON.stringify(this._publisher_domain.fetchNotifications(user_id))
    }
    public notify(user_id: number){
        notify(user_id)
    }
}