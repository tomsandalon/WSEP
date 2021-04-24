import {Purchase} from "../ProductHandling/Purchase";
import {UserHistoryNotFound} from "../ProductHandling/ErrorMessages";


type history_info = {purchase_id:number, shop_id:number, purchase:Purchase};
type history = {user_id: number, history_info: history_info[]};
export interface UserPurchaseHistory{
    history:history[]
    addPurchase(user_id: number, purchase: Purchase): void
    getUserPurchases(user_id: number): Purchase[] | string
}
export class UserPurchaseHistoryImpl implements UserPurchaseHistory{
    private static instance: UserPurchaseHistoryImpl;
    private readonly _history: history[];
    private constructor() {
        this._history = []
    }

    get history(): history[] {
        return this._history;
    }

    public static getInstance(){
        if (this.instance == undefined)
            UserPurchaseHistoryImpl.instance = new UserPurchaseHistoryImpl()
        return this.instance
    }

    public addPurchase(user_id: number, purchase: Purchase): void {
        const info = {
            purchase_id: purchase.order_id,
            shop_id: purchase.shop.shop_id,
            purchase: purchase
        }
        const value = this._history.find(history => history.user_id == user_id);
        if(value == undefined)
            this._history.push({
                user_id:user_id,
                history_info: [info]
            })
        else value.history_info.push(info)
    }

    public getUserPurchases(user_id: number): Purchase[] | string {
        const value = this._history.find(history => history.user_id == user_id)
        if (value === undefined)
            return UserHistoryNotFound
        return value.history_info.map((info: history_info) => info.purchase);
    }
}