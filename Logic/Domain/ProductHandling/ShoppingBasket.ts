import {Product} from "./Product";
import {ProductPurchase, ProductPurchaseImpl} from "./ProductPurchase";
import {Shop} from "../Shop/Shop";
import {ShopInventory} from "../Shop/ShopInventory";
import {
    AmountNonPositiveValue,
    ProductExistsInBasket,
    ProductNotExistInBasket,
    ProductNotFound,
    StockLessThanBasket
} from "./ErrorMessages";
import {Purchase, PurchaseImpl} from "./Purchase";
import {User} from "../Users/User";
import {NotificationAdapter} from "../Notifications/NotificationAdapter";

type Entry = {product: Product, amount: number, price_after_discount: number}
export type ShoppingEntry = {productId: number, amount: number}
export type MinimalUserData = {userId: number, underaged: boolean}

export interface ShoppingBasket {
    basket_id: number
    shop: ShopInventory
    products: Entry[]
    user_data: MinimalUserData


    /**
     * @Requirement 2.7
     * @param product_id
     * @param amount to purchase
     * @return true iff 0 < amount <= product.amount and product_id exists in the shop and this.products.contains(product) == false
     * @return AmountNonPositiveValue iff amount <= 0
     * @return ProductExistsInBasket iff this.product.contains(product) == true
     * @return ErrorOfShop iff product is not found in the shop
     */
    addToBasket(product_id: number, amount: number): boolean | string
    /**
     * @Requirement 2.7
     * @param product_id
     * @param new_amount to purchase
     * @return true iff 0 < amount <= product.amount and product_id exists in the basket
     * @return ProductNotFound iff product not found in store
     * @return AmountNonPositiveValue iff amount <= 0
     */
    editBasketItem(product_id: number, new_amount: number): boolean | string
    /**
     * @Requirement 2.7
     * @param product_id
     * @return true product_id exists in the basket
     * @return ProductNotExistInBasket otherwise
     */
    removeItem(product_id: number): boolean | string

    /**
     * @Requirement 2.9
     * @param payment_info
     * @param coupons
     * @return Error if payment method didnt succeed OR
     *               if delivery TODO
     * @return Purchase representing items and amount specified in basket
     */
    purchase(payment_info: string, coupons: any  []): Promise<string | Purchase>
    toString():string[]
    isEmpty():boolean
}

export class ShoppingBasketImpl implements ShoppingBasket{
    private static _basket_id_specifier: number = 0;
    private _basket_id: number;
    private _products:  Entry[];
    private _user_data: MinimalUserData;


    private _shop: ShopInventory;

    get user_data(): MinimalUserData {
        return this._user_data;
    }

    private constructor(basket_id: number, shop: ShopInventory, product: Entry, user_data: MinimalUserData) {
        this._basket_id = basket_id;
        this._products = [product];
        this._shop = shop;
        this._user_data = user_data
    }

    public static create(shop: ShopInventory, product: ShoppingEntry, user: User): ShoppingBasket | string{
        const fetched_product = shop.getItem(product.productId);
        if (typeof fetched_product === "string"){
            return fetched_product
        }
        const user_data = {userId: user.user_id, underaged: user.underaged}
        const final_product = {product: fetched_product, amount: product.amount,
            price_after_discount: shop.calculatePrice([ProductPurchaseImpl.create(fetched_product, [], product.amount, shop) as ProductPurchase], user_data)};
        const id = this._basket_id_specifier++;
        return new ShoppingBasketImpl(id, shop, final_product, user_data)
    }

    get products(){
        return this._products
    }

    get basket_id(){
        return this._basket_id
    }

    get shop(){
        return this._shop
    }

    public addToBasket(product_id: number, amount: number): boolean | string {
        if(amount <= 0){
            return AmountNonPositiveValue
        } else if (this._products.reduce((acc: boolean, product: Entry) => acc || (product_id == product.product.product_id), false)){
            return ProductExistsInBasket
        }
        const fetched_product = this._shop.getItem(product_id);
        if (typeof fetched_product === "string"){
            return fetched_product
        }
        if (fetched_product.amount < amount) return StockLessThanBasket
        const product = {product: fetched_product, amount: amount,
            price_after_discount: this.shop.calculatePrice([ProductPurchaseImpl.create(fetched_product, [], amount, this.shop) as ProductPurchase], this.user_data)};
        this._products.push(product);
        return true
    }

    public editBasketItem(product_id: number, new_amount: number): boolean | string {
        if (new_amount < 0) return AmountNonPositiveValue
        if (new_amount == 0) return this.removeItem(product_id)
        for (let product of this._products){
            if(product_id == product.product.product_id){
                product.amount = new_amount;
                return true
            }
        }
        return ProductNotFound
    }

    public removeItem(product_id: number): boolean | string {
        const before = this._products.length;
        console.log(`remove ${product_id}`)
        console.log(this.products);
        this._products = this._products.filter((entry) => entry.product.product_id != product_id)
        if (this._products.length == before){
            return ProductNotFound
        }
        return true
    }

    toString(): string[]{
        return [JSON.stringify({
            basket_id: this.basket_id,
            shop: {
                name: this.shop.shop_name,
                id: this.shop.shop_id,
            },
            products: this.products,
            total_price_after_discount: this.shop.calculatePrice(this.products.map(p => ProductPurchaseImpl.create(p.product, [], p.amount, this.shop) as ProductPurchase), this.user_data)
            // user_data: this.user_data,
        })]
        // this._products.map(entry => `PID: ${entry.product.product_id}     Product Name: ${entry.product.name}      Description: ${entry.product.description}        Amount: ${entry.amount}`)
    }
    isEmpty():boolean {
        return this._products.length == 0
    }
    async purchase(payment_info: string, coupons: any[]): Promise<string | Purchase> {
        const order = PurchaseImpl.create(new Date(), this,[], this.shop, this._user_data);
        if(typeof order == "string")
            return order
        // const order_purchase = order.purchase_self(payment_info);
        return order.purchase_self(payment_info)
            .then(order_purchase => {
                if(typeof order_purchase == "string")
                    return order_purchase
                this.shop.notifyOwners(order)
                return order
            })

    }
}