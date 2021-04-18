import {PaymentHandler} from "../Adapters/PaymentHandler";
import {DeliveryHandler} from "../Adapters/DeliveryHandler";
import {ProductPurchase, ProductPurchaseImpl} from "./ProductPurchase";
import {ShoppingBasket} from "./ShoppingBasket";
import {Product, ProductImpl} from "./Product";
import {DiscountType} from "../PurchaseProperties/DiscountType";
import {ShopInventory} from "../Shop/ShopInventory";
import {Shop} from "../Shop/Shop";

export interface Order {
    order_id: number,
    shop: ShopInventory,
    products: ReadonlyArray<ProductPurchase>,
    date: Date,
    purchase_self(): boolean | string
    to_string(): string;
}

export class OrderImpl implements Order{
    private static  _order_id_specifier: number = 0;
    private readonly _order_id: number;
    private readonly _shop: ShopInventory;
    private readonly _date: Date;
    private readonly _products: ReadonlyArray<ProductPurchase>;
    private constructor(date: Date, order_id: number, products: ReadonlyArray<ProductPurchase>, shop: ShopInventory) {
        this._date = date;
        this._order_id = order_id;
        this._products = products;
        this._shop = shop;
    }

    public static create(date: Date, basket: ShoppingBasket, coupons: DiscountType[], shop: ShopInventory): Order | string{
        const products = OrderImpl.analyzeProducts(basket, coupons);
        if(typeof products === "string"){
            return products
        }
        const id = this._order_id_specifier++;
        return new OrderImpl(date, id, products, shop)
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

    get shop(){
        return this._shop
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

    public to_string(): string {//TODO implement this
        return "";
    }
}