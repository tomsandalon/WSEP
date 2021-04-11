import {ShoppingBasket, ShoppingBasketImpl} from "../ProductHandling/ShoppingBasket";
import {Order} from "../ProductHandling/Order";
import {ProductPurchase, ProductPurchaseImpl} from "../ProductHandling/ProductPurchase";
import {logger} from "../Logger";

export interface User {
    user_email: string
    password: string
    cart: ShoppingBasket[]
    order_history: Order[]
    is_admin: boolean

    addToBasket(shop_id: number,product_id: number, amount: number): void
    editBasketItem(shop_id: number,product_id: number, new_amount: number): void
    purchaseBasket(shop_id: number, payment_method: string): string | boolean
    displayBasket(shop_id): ProductPurchase[]
    removeItemFromBasket(shop_id: number,product_id: number):void
    //TODO req: 3.7 - add it.
}
export class UserImpl implements User{
    private _user_email: string
    private _password: string
    private _is_admin: boolean
    private _cart: ShoppingBasket[]
    private _order_history: Order[]

    constructor(user_email:string, password:string, is_admin:boolean) {
        this._user_email = user_email;
        this._password = password;
        this._is_admin = is_admin;
        this._cart = [];
        this._order_history = [];
    }

    removeItemFromBasket(shop_id: number, product_id: number):void {
        let shopping_basket = this._cart.filter(element => element.shop == shop_id) //basket for provided shop_id exists
        if(shopping_basket.length == 0){ //trying to remove an item from a shopping basket that doesnt exist.
            logger.Error("Trying to remove an item from a shopping basket that doesnt exist");
        }
        else{
            //TODO use the removeItem function which is not a part of the interface therefore i cant use it...
            //shopping_basket[0].removeItem(product_id);
        }
        return;
    }

    addToBasket(shop_id: number, product_id: number, amount: number): void {
        let shopping_basket = this._cart.filter(element => element.shop == shop_id) //basket for provided shop_id exists
        if(shopping_basket.length == 0){ //new shopping basket
            let new_basket = ShoppingBasketImpl.create(shop_id,[]);     //TODO why do i have to add items? and even if so i just have the product ID.
            this._cart.push(<ShoppingBasket>new_basket); //TODO check this type assertion
        }
        else{//add to existing
            shopping_basket[0].addToBasket(product_id, amount);
        }
    }

    editBasketItem(shop_id: number, product_id: number, new_amount: number): void {
        let shopping_basket = this._cart.filter(element =>element.shop == shop_id);
        if(shopping_basket.length == 0){// cant edit an item if the shopping basket doesnt exists  yet.
            logger.Error("Can't edit item information to a shop-basket that doesnt exist");
            return;
        }
        else{
            shopping_basket[0].editBasketItem(product_id, new_amount);
        }

    }
    purchaseBasket(shop_id: number, payment_method: string): string | boolean {
        let shopping_basket = this._cart.filter(element =>element.shop == shop_id);
        if(shopping_basket.length == 0){ //trying to purchase a basket that doesnt exist
            logger.Error("Trying to purchase a shop basket that doesnt exist");
            return false;
        }
        else{//TODO payment_handler?
            return true;
        }

    }
    displayBasket(shop_id: any): ProductPurchase[] {
        let shopping_basket = this._cart.filter(element =>element.shop == shop_id);
        if(shopping_basket.length == 0){
            logger.Error("Trying to display a basket that doesnt exist")
            return [];
        }
        else{
            let product_purchase = shopping_basket[0].products; //get products
            let value = product_purchase.map(element => ProductPurchaseImpl.create(element.product , null , element.amount)) ; //TODO NULL IS DISCOUNT?
            //TODO return the value but it may contain strings? talk to mark.
        }
    }

    get user_email(): string {
        return this._user_email;
    }

    get password(): string {
        return this._password;
    }

    get is_admin(): boolean {
        return this._is_admin;
    }

    get cart():ShoppingBasket[] {
        return this._cart;
    }
    get order_history():Order[]
    {
        return this._order_history;
    }

}

