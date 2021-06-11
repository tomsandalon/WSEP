import {ProductPurchase, ProductPurchaseImpl} from "./ProductPurchase";
import {MinimalUserData, ShoppingBasket} from "./ShoppingBasket";
import {ShopInventory} from "../Shop/ShopInventory";
import {DeliveryDenied, DiscountNotExists, PaymentDenied} from "./ErrorMessages";
import {PaymentAndSupplyAdapter, Purchase_Info} from "../../../ExternalApiAdapters/PaymentAndSupplyAdapter";

export interface Purchase {
    order_id: number,
    shop: ShopInventory,
    products: ReadonlyArray<ProductPurchase>,
    date: Date,
    minimal_user_data: MinimalUserData

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
    purchase_self(payment_info: string | Purchase_Info): Promise<boolean | string>

    toString(): string;
}

export class PurchaseImpl implements Purchase {
    private static _order_id_specifier: number = 0;
    private readonly _order_id: number;
    private readonly _shop: ShopInventory;
    private readonly _date: Date;
    private readonly _products: ReadonlyArray<ProductPurchase>;

    constructor(date: Date, minimal_user_data: MinimalUserData, products: ReadonlyArray<ProductPurchase>, shop: ShopInventory, order_id: number) {
        this._date = date;
        this._order_id = order_id;
        this._products = products;
        this._shop = shop;
        this._minimal_user_data = minimal_user_data
    }

    get order_id() {
        return this._order_id
    }

    get shop() {
        return this._shop
    }

    get date() {
        return this._date
    }

    get products() {
        return this._products
    }

    private _minimal_user_data: MinimalUserData;

    get minimal_user_data(): MinimalUserData {
        return this._minimal_user_data;
    }

    static resetIDs = () => PurchaseImpl._order_id_specifier = 0

    // private calculatePrice(){
    //     return this._products.reduce((sum, product) => sum + product.actual_price, 0);
    // }

    public static create(date: Date, basket: ShoppingBasket, coupons: any[], shop: ShopInventory, minimal_user_data: MinimalUserData): Purchase | string {
        const products = basket.products.map((product) => ProductPurchaseImpl.create(product.product, coupons, product.amount, shop));
        const isBad = products.some((product) => typeof product === "string");
        if (isBad) {
            return DiscountNotExists
        }
        const id = this._order_id_specifier++;
        return new PurchaseImpl(date, minimal_user_data, products as ProductPurchase[], basket.shop, id)
    }

    async purchase_self(payment_info: string | Purchase_Info): Promise<string | boolean> {
        const s = PaymentAndSupplyAdapter.getInstance()
        return s.handshake()
            .then(res => {
                if (!res) return `Failed to perform handshake with payment server`
                const total_price = this.shop.calculatePrice(this.products, this.minimal_user_data);
                const result_of_purchase = this._shop.purchaseItems(this._products, this._minimal_user_data);
                if (typeof result_of_purchase === "string") {
                    return result_of_purchase
                }
                // const result_payment = PaymentHandlerImpl.getInstance().charge(payment_info, total_price, this._shop.bank_info);
                return (typeof payment_info == "string" ? s.pay(payment_info, payment_info, payment_info, payment_info, payment_info, payment_info) :
                    s.pay(payment_info.payment_info.card_number,
                        payment_info.payment_info.month,
                        payment_info.payment_info.year,
                        payment_info.payment_info.holder_name,
                        payment_info.payment_info.ccv,
                        payment_info.payment_info.holder_id))
                    .then(payment_transaction_id => {
                        if (payment_transaction_id == -1) {
                            this._shop.returnItems(this._products)
                            return PaymentDenied
                        }
                        return (typeof payment_info == "string" ? s.supply(payment_info, payment_info, payment_info, payment_info, payment_info) :
                            s.supply(payment_info.delivery_info.name,
                                payment_info.delivery_info.address,
                                payment_info.delivery_info.city,
                                payment_info.delivery_info.country,
                                payment_info.delivery_info.zip))
                            .then(supply_transaction_id => {
                                if (supply_transaction_id == -1) {
                                    s.cancel_pay(payment_transaction_id.toString())
                                        .then(_ => {
                                            this._shop.returnItems(this._products)
                                            return DeliveryDenied
                                        })
                                }
                                return true
                            })
                    })
            })
    }

    public toString(): string {
        return JSON.stringify({
            order_id: this.order_id,
            shop: this.shop.shop_id,
            shop_name: this.shop.shop_name,
            products: this.products,
            date: this.date,
            minimal_user_data: this.minimal_user_data
        })
        // return `Order details:\n` +
        //     `Purchased in: ${this.shop.shop_name}\n` +
        //     `Order number: ${this.order_id}\n` +
        //     `Was performed: ${this.date.toString()}\n` +
        //     `Products:\n${this.products.reduce((acc: string, product: ProductPurchase) =>
        //         acc +`\t${product.name}\t${product.product_id}\t${product.amount}\n`, ``)}`;
    }
}