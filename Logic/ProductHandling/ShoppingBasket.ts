import {Product} from "./Product";
import {ProductPurchase} from "./ProductPurchase";
import {Shop} from "../Shop/Shop";
import {ShopInventory} from "../Shop/ShopInventory";
import {AmountNonPositiveValue, ProductExistsInBasket, ProductNotExistInBasket, ProductNotFound} from "./ErrorMessages";

type Entry = {product: Product, amount: number}
export type ShoppingEntry = {productId: number, amount: number}

export interface ShoppingBasket {
    basket_id: number
    shop: ShopInventory
    products: Entry[]

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
     * @param amount to purchase
     * @return true iff 0 < amount <= product.amount and product_id exists in the basket
     * @return ProductNotFound iff product not found in store
     * @return AmountNonPositiveValue iff amount <= 0
     */
    editBasketItem(product_id: number, new_amount: number): boolean | string
    /**
     * @Requirement 2.7
     * @param product_id
     * @param amount to purchase
     * @return true iff 0 < amount <= product.amount and product_id exists in the basket
     * @return ProductNotExistInBasket otherwise
     */
    removeItem(product_id: number): boolean | string
    toStringBasket():string[]
}

export class ShoppingBasketImpl implements ShoppingBasket{
    private static _basket_id_specifier: number = 0;
    private _basket_id: number;
    private _products:  Entry[];
    private _shop: ShopInventory;


    private constructor(basket_id: number, shop: ShopInventory, product: Entry) {
        this._basket_id = basket_id;
        this._products = [product];
        this._shop = shop;
    }

    public static create(shop: ShopInventory, product: ShoppingEntry): ShoppingBasket | string{
        const fetched_product = shop.getItem(product.productId);
        if (typeof fetched_product === "string"){
            return fetched_product
        }
        const final_product = {product: fetched_product, amount: product.amount};
        const id = this._basket_id_specifier++;
        return new ShoppingBasketImpl(id, shop, final_product)
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
        } else if (this._products.reduce((acc: boolean, product: Entry) => acc && (product_id != product.product.product_id), true)){
            return ProductExistsInBasket
        }
        const fetched_product = this._shop.getItem(product_id);
        if (typeof fetched_product === "string"){
            return fetched_product
        }
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
                const difference = product.amount - new_amount;
                if (difference > 0){
                    product.product.returnAmount(difference);
                } else if (difference < 0) {
                    product.product.makePurchase(difference);
                }
                product.amount = new_amount;
                //else aka do nothing
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

    toStringBasket(): string[]{
        return this._products.map(entry => `PID: ${entry.product.product_id}     Product Name: ${entry.product.name}      Description: ${entry.product.description}        Amount: ${entry.product.amount}`)

    }


}