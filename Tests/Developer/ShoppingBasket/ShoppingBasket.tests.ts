import 'mocha';
import * as Parallel from 'async-parallel';
import { expect, assert } from 'chai';
import {ProductImpl} from "../../../Logic/Domain/ProductHandling/Product";
import {ShopImpl} from "../../../Logic/Domain/Shop/Shop";
import {PurchasePolicyHandler} from "../../../Logic/Domain/PurchaseProperties/PurchasePolicyHandler";
import {DiscountPolicyHandler} from "../../../Logic/Domain/PurchaseProperties/DiscountPolicyHandler";
import {User, UserImpl} from "../../../Logic/Domain/Users/User";
import {ShopInventory} from "../../../Logic/Domain/Shop/ShopInventory";

const createProduct = () => {
    const temp = ProductImpl.create(1000, "Best 29 inch Monitor", "LG monitor", {});
    if(typeof temp === "string"){
        assert.fail("Failed to created product")
    }
    return temp
};

describe('Buy product not by policy', () => {
    const getNewItem = (shop: ShopInventory): number => shop.products.reduce((acc, product) => Math.max(product.product_id, acc), -1);
    it('Buy product by purchase policy', () => {
        const shop: ShopImpl = new ShopImpl("Tom@gmail.com", "12345-TOM-SAND", "Best local shop in the negev", "Negev", "Tom and sons",
            {
                isAllowed(object: any): boolean {
                    return true;
                },
                getInstance(): PurchasePolicyHandler {
                    return this;
                }
            },
            {
                isAllowed(object: any): boolean {
                    return true;
                },
                getInstance(): DiscountPolicyHandler {
                    return this;
                }
            });
        const user: User = new UserImpl();
        let result: any = shop.addItem("Tom@gmail.com", "GTX", "GPU", 1000, ["GPU", "HW"], 1000, {
            expiration_date: new Date(), percent: 10,
            applyDiscount(price: number): number {
                return price* ((100 - this.percent)/100);
            }, can_be_applied(value: any): boolean {
                return true;
            }
        }, {});
        expect(typeof result !== "string").to.be.true;
        result = user.addToBasket(shop.inventory, getNewItem(shop.inventory), 50);
        expect(typeof result !== "string").to.be.true;
        result =user.purchaseBasket(shop.shop_id,"1234-Israel-Israeli");
        expect(typeof result !== "string").to.be.true;
    });
    it('Buy product by discount policy', () => {
        const shop: ShopImpl = new ShopImpl("Tom@gmail.com", "12345-TOM-SAND", "Best local shop in the negev", "Negev", "Tom and sons",
            {
                isAllowed(object: any): boolean {
                    return true;
                },
                getInstance(): PurchasePolicyHandler {
                    return this;
                }
            },
            {
                isAllowed(object: any): boolean {
                    return true;
                },
                getInstance(): DiscountPolicyHandler {
                    return this;
                }
            });
        const user: User = new UserImpl();
        shop.addItem("Tom@gmail.com", "GTX", "GPU", 1000, ["GPU", "HW"], 1000, {
            expiration_date: new Date(), percent: 10,
            applyDiscount(price: number): number {
                return price* ((100 - this.percent)/100);
            }, can_be_applied(value: any): boolean {
                return true;
            }
        }, {});
        let result: any = shop.addItem("Tom@gmail.com", "GTX", "GPU", 1000, ["GPU", "HW"], 1000, {
            expiration_date: new Date(), percent: 10,
            applyDiscount(price: number): number {
                return price* ((100 - this.percent)/100);
            }, can_be_applied(value: any): boolean {
                return true;
            }
        }, {});
        expect(typeof result !== "string").to.be.true;
        result = user.addToBasket(shop.inventory, getNewItem(shop.inventory), 50);
        expect(typeof result !== "string").to.be.true;
        result =user.purchaseBasket(shop.shop_id,"1234-Israel-Israeli");
        expect(typeof result !== "string").to.be.true;
    });
    it('Buy product not by discount policy', () => {
        const shop: ShopImpl = new ShopImpl("Tom@gmail.com", "12345-TOM-SAND", "Best local shop in the negev", "Negev", "Tom and sons",
           {
               isAllowed(object: any): boolean {
                   return true;
               },
               getInstance(): PurchasePolicyHandler {
                   return this;
               }
           },
           {
               isAllowed(object: any): boolean {
                   return false;
               },
               getInstance(): DiscountPolicyHandler {
                   return this;
               }
           });
        const user: User = new UserImpl();
        let result: any = shop.addItem("Tom@gmail.com", "GTX", "GPU", 1000, ["GPU", "HW"], 1000, {
            expiration_date: new Date(), percent: 10,
            applyDiscount(price: number): number {
                return price* ((100 - this.percent)/100);
            }, can_be_applied(value: any): boolean {
                return true;
            }
        }, {});
        expect(typeof result !== "string").to.be.true;
        result = user.addToBasket(shop.inventory, getNewItem(shop.inventory), 50);
        expect(typeof result !== "string").to.be.true;
        result =user.purchaseBasket(shop.shop_id,"1234-Israel-Israeli");
        expect(typeof result === "string").to.be.true;
   });
    it('Buy product not by purchase policy', () => {
        const shop: ShopImpl = new ShopImpl("Tom@gmail.com", "12345-TOM-SAND", "Best local shop in the negev", "Negev", "Tom and sons",
            {
                isAllowed(object: any): boolean {
                    return false;
                },
                getInstance(): PurchasePolicyHandler {
                    return this;
                }
            },
            {
                isAllowed(object: any): boolean {
                    return true;
                },
                getInstance(): DiscountPolicyHandler {
                    return this;
                }
            });
        const user: User = new UserImpl();
        let result: any = shop.addItem("Tom@gmail.com", "GTX", "GPU", 1000, ["GPU", "HW"], 1000, {
            expiration_date: new Date(), percent: 10,
            applyDiscount(price: number): number {
                return price* ((100 - this.percent)/100);
            }, can_be_applied(value: any): boolean {
                return true;
            }
        }, {});
        expect(typeof result !== "string").to.be.true;
        result = user.addToBasket(shop.inventory, getNewItem(shop.inventory), 50);
        expect(typeof result !== "string").to.be.true;
        result =user.purchaseBasket(shop.shop_id,"1234-Israel-Israeli");
        expect(typeof result === "string").to.be.true;
    });
});

describe('Product Class Testsuit', () => {
    it('should return 2', () => {
        Parallel.pool(2,
            async () => {
                return true;
        });
    });
});