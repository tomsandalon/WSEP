import 'mocha';
import {assert, expect} from 'chai';
import {ProductImpl} from "../../../Logic/Domain/ProductHandling/Product";
import {ShopImpl} from "../../../Logic/Domain/Shop/Shop";
import {User, UserImpl} from "../../../Logic/Domain/Users/User";
import {ShopInventory} from "../../../Logic/Domain/Shop/ShopInventory";
import {describe} from "mocha";
import {ConditionType, SimpleCondition} from "../../../Logic/Domain/Shop/PurchasePolicy/SimpleCondition";
import {SimpleDiscount} from "../../../Logic/Domain/Shop/DiscountPolicy/SimpleDiscount";
import {Condition} from "../../../Logic/Domain/Shop/DiscountPolicy/ConditionalDiscount";
import {DiscountHandler} from "../../../Logic/Domain/Shop/DiscountPolicy/DiscountHandler";
import {NumericOperation} from "../../../Logic/Domain/Shop/DiscountPolicy/NumericCompositionDiscount";
import {id_counter} from "../../../Logic/Domain/Shop/PurchasePolicy/PurchaseCondition";
import {Operator} from "../../../Logic/Domain/Shop/PurchasePolicy/CompositeCondition";


const createProduct = () => {
    const temp = ProductImpl.create(1000, "Best 29 inch Monitor", "LG monitor");
    if(typeof temp === "string"){
        assert.fail("Failed to created product")
    }
    return temp
};

const getNewItem = (shop: ShopInventory): number => shop.products.reduce((acc, product) => Math.max(product.product_id, acc), -1);

describe('Buy product by policies', () => {
    ProductImpl.resetIDs();
    it('Buy product by conditional discount policy', () => {
        const shop: ShopImpl = new ShopImpl("Tom@gmail.com", "12345-TOM-SAND", "Best local shop in the negev", "Negev", "Tom and sons");
        const user: User = new UserImpl();
        shop.addItem("Tom@gmail.com", "GTX", "GPU", 999, ["GPU", "HW"], 1000);
        shop.addDiscount("Tom@gmail.com", new SimpleDiscount(0.5))
        shop.addConditionToDiscount("Tom@gmail.com", DiscountHandler.discountCounter - 1, Condition.Product_Name, "GTX")
        user.addToBasket(shop.inventory, getNewItem(shop.inventory), 10);
        user.purchaseBasket(shop.shop_id,"1234-Israel-Israeli");
        expect((user.getOrderHistory() as string[])[0]).to.include(10*1000*0.5)
    });
    it('Buy product by composite discount policy', () => {
        const shop: ShopImpl = new ShopImpl("Tom@gmail.com", "12345-TOM-SAND", "Best local shop in the negev", "Negev", "Tom and sons");
        const user: User = new UserImpl();
        shop.addItem("Tom@gmail.com", "GTX", "GPU", 999, ["GPU", "HW"], 1000);
        shop.addDiscount("Tom@gmail.com", new SimpleDiscount(0.5))
        shop.addConditionToDiscount("Tom@gmail.com", DiscountHandler.discountCounter - 1, Condition.Product_Name, "GTX")
        shop.addDiscount("Tom@gmail.com", new SimpleDiscount(0.3))
        shop.addNumericCompositionDiscount("Tom@gmail.com", NumericOperation.Add, DiscountHandler.discountCounter - 1, DiscountHandler.discountCounter - 2)
        user.addToBasket(shop.inventory, getNewItem(shop.inventory), 50);
        user.purchaseBasket(shop.shop_id,"1234-Israel-Israeli");
        expect((user.getOrderHistory() as string[])[0]).to.include(50*1000*0.2)
    });
    it('Buy product by simple purchase policy', () => {
        const shop: ShopImpl = new ShopImpl("Tom@gmail.com", "12345-TOM-SAND", "Best local shop in the negev", "Negev", "Tom and sons")
        const user: User = new UserImpl();
        shop.addPolicy("Tom@gmail.com", new SimpleCondition(ConditionType.NotCategory, "GPU"))
        let result: any = shop.addItem("Tom@gmail.com", "GTX", "GPU", 1000, ["GPU", "HW"], 1000);
        expect(typeof result !== "string").to.be.true;
        result = user.addToBasket(shop.inventory, getNewItem(shop.inventory), 50);
        expect(typeof result !== "string").to.be.true;
        result = user.purchaseBasket(shop.shop_id, "1234-Israel-Israeli");
        expect(typeof result === "string").to.be.true;
    });
    it('Buy product by composite purchase policy', () => {
        const shop: ShopImpl = new ShopImpl("Tom@gmail.com", "12345-TOM-SAND", "Best local shop in the negev", "Negev", "Tom and sons")
        const user: User = new UserImpl();
        shop.addPolicy("Tom@gmail.com", new SimpleCondition(ConditionType.NotCategory, "GPU"))
        shop.addPolicy("Tom@gmail.com", new SimpleCondition(ConditionType.LowerAmount, 2))
        shop.composePurchasePolicies("Tom@gmail.com", id_counter - 1, id_counter - 2, Operator.And)
        shop.addItem("Tom@gmail.com", "GTX", "GPU", 1000, ["GPU", "HW"], 1000);
        user.addToBasket(shop.inventory, getNewItem(shop.inventory), 50);
        let result = user.purchaseBasket(shop.shop_id, "1234-Israel-Israeli");
        expect(typeof result === "string").to.be.true;
    });
    it('Buy product not by discount policy', () => {
        const shop: ShopImpl = new ShopImpl("Tom@gmail.com", "12345-TOM-SAND", "Best local shop in the negev", "Negev", "Tom and sons");
        const user: User = new UserImpl();
        shop.addItem("Tom@gmail.com", "GTX", "GPU", 999, ["GPU", "HW"], 1000);
        shop.addDiscount("Tom@gmail.com", new SimpleDiscount(0.5))
        shop.addConditionToDiscount("Tom@gmail.com", DiscountHandler.discountCounter - 1, Condition.Product_Name, "GTmanyX")
        user.addToBasket(shop.inventory, getNewItem(shop.inventory), 50);
        user.purchaseBasket(shop.shop_id,"1234-Israel-Israeli");
        expect((user.getOrderHistory() as string[])[0]).to.include(1000*50)
   }); })
describe("Purchase test", () => {
    it('purchase positive amount and more than stock', () => {
        const shop: ShopImpl = new ShopImpl("Tom@gmail.com", "12345-TOM-SAND", "Best local shop in the negev", "Negev", "Tom and sons");
        const user: User = new UserImpl();        shop.addItem("Tom@gmail.com", "GTX", "GPU", 1000, ["GPU", "HW"], 1000);
        user.addToBasket(shop.inventory, getNewItem(shop.inventory), 5000);
        const result = user.purchaseBasket(shop.shop_id,"1234-Israel-Israeli");
        expect(typeof result == "string" && result.includes("doesn't have enough in stock for this purchase")).to.be.true
    });
    it('Two concurrent purchases or item which cause lack to stock', () => {
        const shop: ShopImpl = new ShopImpl("Tom@gmail.com", "12345-TOM-SAND", "Best local shop in the negev", "Negev", "Tom and sons");
        const user1: User = new UserImpl();
        const user2: User = new UserImpl();
        shop.addItem("Tom@gmail.com", "GTX", "GPU", 1000, ["GPU", "HW"], 1000);
        user1.addToBasket(shop.inventory, getNewItem(shop.inventory), 999);
        user2.addToBasket(shop.inventory, getNewItem(shop.inventory), 999);
        let result = user1.purchaseBasket(shop.shop_id,"1234-Israel-Israeli");
        expect(typeof result == "string").to.be.false
        result = user2.purchaseBasket(shop.shop_id,"1234-Israel-Israeli");
        expect(typeof result == "string").to.be.true
    });
})