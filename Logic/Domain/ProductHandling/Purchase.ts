import {PaymentHandler, PaymentHandlerImpl} from "../../Service/Adapters/PaymentHandler";
import {DeliveryHandler, DeliveryHandlerImpl} from "../../Service/Adapters/DeliveryHandler";
import {ProductPurchase, ProductPurchaseImpl} from "./ProductPurchase";
import {ShoppingBasket} from "./ShoppingBasket";
import {Product, ProductImpl} from "./Product";
import {DiscountType} from "../PurchaseProperties/DiscountType";
import {ShopInventory} from "../Shop/ShopInventory";
import {Shop} from "../Shop/Shop";
import {DeliveryDenied, DiscountNotExists, PaymentDenied} from "./ErrorMessages";

export interface Purchase {
    order_id: number,
    shop: ShopInventory,
    products: ReadonlyArray<ProductPurchase>,
    date: Date,

    /**
     * @Requirement 2.9
     * @param  payment_info of the customer
     * @param   coupons     of Discount
     * @return true iff:
     *                  1. Charging the customer was successful
     *                  2. Calling the delivery service successfully
     *                  3. Saving the order in DB was successful
     * @return ErrorMessage otherwise
     */
    purchase_self(payment_info: string): boolean | string
    to_string(): string;
}

export class PurchaseImpl implements Purchase{
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

    static resetIDs = () => PurchaseImpl._order_id_specifier = 0

    public static create(date: Date, basket: ShoppingBasket, coupons: DiscountType[]): Purchase | string{
        const products = basket.products.map((product) =>  ProductPurchaseImpl.create(product.product, coupons, product.amount));
        const isBad = products.some((product) => typeof product === "string");
        if(isBad){
            return DiscountNotExists
        }
        const id = this._order_id_specifier++;
        return new PurchaseImpl(date, id, products as ProductPurchase[], basket.shop)
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

    private calculatePrice(){
        return this._products.reduce((sum, product) => sum + product.actual_price, 0);
    }

    public purchase_self(payment_info: string): boolean | string  {
        const result_of_purchase = this._shop.purchaseItems(this._products);
        if(typeof result_of_purchase === "string"){
            return result_of_purchase
        }
        this.shop.logOrder(this)
        const total_price =  this.calculatePrice();
        const result_payment = PaymentHandlerImpl.getInstance().charge(payment_info, total_price, this._shop.bank_info);
        if (typeof result_payment == "string" || !result_payment){
            this._shop.returnItems(this._products)
            return PaymentDenied
        }
        const result_delivery = DeliveryHandlerImpl.getInstance().deliver(payment_info, this);
        if (typeof result_delivery == "string" || !result_delivery){
            PaymentHandlerImpl.getInstance().cancelCharge(payment_info, total_price, this._shop.bank_info);
            this._shop.returnItems(this._products)
            return DeliveryDenied
        }
        return true;
    }

    public to_string(): string {
        return `Order details:\n` +
            `Purchased in: ${this.shop.shop_name}\n` +
            `Order number: ${this.order_id}\n` +
            `Was performed: ${this.date.toString()}\n` +
            `Products:\n${this.products.reduce((acc: string, product: ProductPurchase) =>
                acc +`\t${product.name}\t${product.product_id}\t${product.amount}\n`, ``)}`;
    }
}