import {Product} from "./Product";
import {ProductPurchase} from "./ProductPurchase";
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
import {DiscountType} from "../PurchaseProperties/DiscountType";
import {User} from "../Users/User";

type Entry = {product: Product, amount: number}
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
    purchase(payment_info: string, coupons: DiscountType[]): string | Purchase
    toString():string[]
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
        const final_product = {product: fetched_product, amount: product.amount};
        const id = this._basket_id_specifier++;
        return new ShoppingBasketImpl(id, shop, final_product, {userId: user.user_id, underaged: user.underaged})
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
        } else if (this._products.reduce((acc: boolean, product: Entry) => acc || (product_id != product.product.product_id), false)){
            return ProductExistsInBasket
        }
        const fetched_product = this._shop.getItem(product_id);
        if (typeof fetched_product === "string"){
            return fetched_product
        }
        if (fetched_product.amount < amount) return StockLessThanBasket
        const product = {product: fetched_product, amount: amount};
        this._products.push(product);
        return true
    }

    public editBasketItem(product_id: number, new_amount: number): boolean | string {
        if (new_amount <= 0) {
            return AmountNonPositiveValue
        }
        for (let product of this._products){
            if(product_id == product.product.product_id){
                product.amount = new_amount;
                return true
            }
        }
        return ProductNotFound
    }

    public removeItem(product_id: number): boolean | string {
        const position: number = this._products.reduce((acc: number, product: Entry, index: number) => (product_id == product.product.product_id)? index: acc, -1);
        if (position < 0){
            return ProductNotExistInBasket
        }
        this._products.splice(position, 1);
        return true
    }

    toString(): string[]{
        return [JSON.stringify({
            basket_id: this.basket_id,
            shop: this.shop.toString(),
            products: this.products,
            user_data: this.user_data,
        })]
        // this._products.map(entry => `PID: ${entry.product.product_id}     Product Name: ${entry.product.name}      Description: ${entry.product.description}        Amount: ${entry.amount}`)
    }

    purchase(payment_info: string, coupons: DiscountType[]): string | Purchase {
        const order = PurchaseImpl.create(new Date(), this,[], this._user_data);
        if(typeof order == "string")
            return order
        const order_purchase = order.purchase_self(payment_info);
        if(typeof order_purchase == "string")
            return order_purchase
        return order
    }
}