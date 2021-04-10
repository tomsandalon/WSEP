import {PaymentHandler} from "../Adapters/PaymentHandler";
import {DeliveryHandler} from "../Adapters/DeliveryHandler";
import {ProductPurchase, ProductPurchaseImpl} from "./ProductPurchase";
import {ShoppingBasket} from "./ShoppingBasket";
import {Product, ProductImpl} from "./Product";
import {DiscountType} from "../PurchaseProperties/DiscountType";

export interface Order {
    order_id: number,
    shop_id: any,
    products: ReadonlyArray<ProductPurchase>,
    date: Date,
    purchase_self(): boolean | string


}

export class OrderImpl implements Order{
    private static  _order_id_specifier: number = 0;
    private readonly _order_id: number;
    private readonly _shop_id: any;
    private readonly _date: Date;
    private readonly _products: ReadonlyArray<ProductPurchase>;
    private constructor(date: Date, order_id: number, products: ReadonlyArray<ProductPurchase>, shop_id: any) {
        this._date = date;
        this._order_id = order_id;
        this._products = products;
        this._shop_id = shop_id;
    }

    public static create(date: Date, basket: ShoppingBasket, coupons: DiscountType[], shop_id: any): Order | string{
        const products = OrderImpl.analyzeProducts(basket, coupons);
        if(typeof products === "string"){
            return products
        }
        const id = this._order_id_specifier++;
        return new OrderImpl(date, id, products, shop_id)
    }

    private static analyzeProducts(basket: ShoppingBasket, coupons: DiscountType[]): ReadonlyArray<ProductPurchase> | string {
        let purchasedProducts: ProductPurchase[] = [];
        for (let product of basket.products){
            const purchased = ProductPurchaseImpl.create(product.product, coupons, product.amount);
            if(typeof purchased === "string"){
                return purchased
            }
            purchasedProducts.push(purchased)
        }
        return purchasedProducts
    }

    get order_id(){
        return this._order_id
    }

    get shop_id(){
        return this._shop_id
    }

    get date(){
        return this._date
    }

    get products(){
        return this._products
    }
    public purchase_self(): boolean | string  {
        //TODO save to DB
        return true;
    }
}