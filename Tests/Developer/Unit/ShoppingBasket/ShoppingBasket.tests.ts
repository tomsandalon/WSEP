import 'mocha';
import {assert, expect} from 'chai';
import {ProductImpl} from "../../../../Logic/Domain/ProductHandling/Product";
import {ShopImpl} from "../../../../Logic/Domain/Shop/Shop";
import {User, UserImpl} from "../../../../Logic/Domain/Users/User";
import {id_counter, Purchase_Type, ShopInventory} from "../../../../Logic/Domain/Shop/ShopInventory";
import {describe} from "mocha";
import {ConditionType, SimpleCondition} from "../../../../Logic/Domain/Shop/PurchasePolicy/SimpleCondition";
import {SimpleDiscount} from "../../../../Logic/Domain/Shop/DiscountPolicy/SimpleDiscount";
import {Condition} from "../../../../Logic/Domain/Shop/DiscountPolicy/ConditionalDiscount";
import {DiscountHandler} from "../../../../Logic/Domain/Shop/DiscountPolicy/DiscountHandler";
import {NumericOperation} from "../../../../Logic/Domain/Shop/DiscountPolicy/NumericCompositionDiscount";
import {Operator} from "../../../../Logic/Domain/Shop/PurchasePolicy/CompositeCondition";
import {offer_id_counter} from "../../../../Logic/Domain/ProductHandling/Offer";


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
    it('Buy product by conditional discount policy', async () => {
        const shop: ShopImpl = ShopImpl.create("Tom@gmail.com", "12345-TOM-SAND", "Best local shop in the negev", "Negev", "Tom and sons");
        const user: User = UserImpl.create();
        shop.addItem("Tom@gmail.com", "GTX", "GPU", 999, ["GPU", "HW"], 1000);
        shop.addDiscount("Tom@gmail.com", SimpleDiscount.create(0.5))
        shop.addConditionToDiscount("Tom@gmail.com", DiscountHandler.discountCounter - 1, Condition.Product_Name, "GTX")
        user.addToBasket(shop.inventory, getNewItem(shop.inventory), 10);
        await user.purchaseBasket(shop.shop_id, "1234-Israel-Israeli")
        expect(user.getOrderHistory() as string[])[0].to.include(10 * 1000 * 0.5)
    });
    it('Buy product by composite discount policy', async () => {
        const shop: ShopImpl = ShopImpl.create("Tom@gmail.com", "12345-TOM-SAND", "Best local shop in the negev", "Negev", "Tom and sons");
        const user: User = UserImpl.create();
        shop.addItem("Tom@gmail.com", "GTX", "GPU", 999, ["GPU", "HW"], 1000);
        shop.addDiscount("Tom@gmail.com", SimpleDiscount.create(0.5))
        shop.addConditionToDiscount("Tom@gmail.com", DiscountHandler.discountCounter - 1, Condition.Product_Name, "GTX")
        shop.addDiscount("Tom@gmail.com", SimpleDiscount.create(0.3))
        shop.addNumericCompositionDiscount("Tom@gmail.com", NumericOperation.Add, DiscountHandler.discountCounter - 1, DiscountHandler.discountCounter - 2)
        user.addToBasket(shop.inventory, getNewItem(shop.inventory), 50);
        await user.purchaseBasket(shop.shop_id, "1234-Israel-Israeli")
        expect((user.getOrderHistory() as string[])[0]).to.include(50 * 1000 * 0.2)

    });
    it('Buy product by simple purchase policy', async () => {
        const shop: ShopImpl = ShopImpl.create("Tom@gmail.com", "12345-TOM-SAND", "Best local shop in the negev", "Negev", "Tom and sons")
        const user: User = UserImpl.create();
        shop.addPolicy("Tom@gmail.com", SimpleCondition.create(ConditionType.NotCategory, "GPU"))
        let result: any = shop.addItem("Tom@gmail.com", "GTX", "GPU", 1000, ["GPU", "HW"], 1000);
        expect(typeof result !== "string").to.be.true;
        result = user.addToBasket(shop.inventory, getNewItem(shop.inventory), 50);
        expect(typeof result !== "string").to.be.true;
        result = await user.purchaseBasket(shop.shop_id, "1234-Israel-Israeli")
        expect(typeof result === "string").to.be.true
    });
    it('Buy product by composite purchase policy', async () => {
        const shop: ShopImpl = ShopImpl.create("Tom@gmail.com", "12345-TOM-SAND", "Best local shop in the negev", "Negev", "Tom and sons")
        const user: User = UserImpl.create();
        shop.addPolicy("Tom@gmail.com", SimpleCondition.create(ConditionType.NotCategory, "GPU"))
        shop.addPolicy("Tom@gmail.com", SimpleCondition.create(ConditionType.LowerAmount, 2))
        shop.composePurchasePolicies("Tom@gmail.com", id_counter - 1, id_counter - 2, Operator.And)
        shop.addItem("Tom@gmail.com", "GTX", "GPU", 1000, ["GPU", "HW"], 1000);
        user.addToBasket(shop.inventory, getNewItem(shop.inventory), 50);
        const result = await user.purchaseBasket(shop.shop_id, "1234-Israel-Israeli")
        expect(typeof result === "string").to.be.true
    });
    it('Buy product not by discount policy', async () => {
        const shop: ShopImpl = ShopImpl.create("Tom@gmail.com", "12345-TOM-SAND", "Best local shop in the negev", "Negev", "Tom and sons");
        const user: User = UserImpl.create();
        shop.addItem("Tom@gmail.com", "GTX", "GPU", 999, ["GPU", "HW"], 1000);
        shop.addDiscount("Tom@gmail.com", SimpleDiscount.create(0.5))
        shop.addConditionToDiscount("Tom@gmail.com", DiscountHandler.discountCounter - 1, Condition.Product_Name, "GTmanyX")
        user.addToBasket(shop.inventory, getNewItem(shop.inventory), 50);
        await user.purchaseBasket(shop.shop_id, "1234-Israel-Israeli")
        expect((user.getOrderHistory() as string[])[0]).to.include(1000 * 50)
    });
    it('Buy product by basic offer', async () => {
        const shop: ShopImpl = ShopImpl.create("Tom@gmail.com", "12345-TOM-SAND", "Best local shop in the negev", "Negev", "Tom and sons");
        const user: UserImpl = UserImpl.create();
        shop.addPurchaseType("Tom@gmail.com", Purchase_Type.Offer)
        shop.addItem("Tom@gmail.com", "GTX", "GPU", 999, ["GPU", "HW"], 20000, Purchase_Type.Offer);
        user.makeOffer(shop.inventory, getNewItem(shop.inventory), 1, 1000)
        shop.acceptOfferAsManagement("Tom@gmail.com", offer_id_counter - 1)
        await user.purchaseOffer(offer_id_counter - 1, "Some info")
        expect((user.getOrderHistory() as string[])[0]).to.include(1000)
    })
    it('Try to buy product by basic offer with denial', async () => {
        const shop: ShopImpl = ShopImpl.create("Tom@gmail.com", "12345-TOM-SAND", "Best local shop in the negev", "Negev", "Tom and sons");
        const user: UserImpl = UserImpl.create();
        shop.addPurchaseType("Tom@gmail.com", Purchase_Type.Offer)
        shop.addItem("Tom@gmail.com", "GTX", "GPU", 999, ["GPU", "HW"], 20000, Purchase_Type.Offer);
        user.makeOffer(shop.inventory, getNewItem(shop.inventory), 1, 1000)
        shop.denyOfferAsManagement("Tom@gmail.com", offer_id_counter - 1)
        await user.purchaseOffer(offer_id_counter - 1, "Some info")
        expect((user.getOrderHistory() as string[])[0]).to.not.include(1000)
    })
    it('Try to buy product with counter offer from shop', async () => {
        const shop: ShopImpl = ShopImpl.create("Tom@gmail.com", "12345-TOM-SAND", "Best local shop in the negev", "Negev", "Tom and sons");
        const user: UserImpl = UserImpl.create();
        shop.addPurchaseType("Tom@gmail.com", Purchase_Type.Offer)
        shop.addItem("Tom@gmail.com", "GTX", "GPU", 999, ["GPU", "HW"], 20000, Purchase_Type.Offer);
        user.makeOffer(shop.inventory, getNewItem(shop.inventory), 1, 1000)
        shop.counterOfferAsManagement("Tom@gmail.com", offer_id_counter - 1, 500)
        await user.purchaseOffer(offer_id_counter - 1, "Some info")
        expect((user.getOrderHistory() as string[])[0]).to.not.include(500)
    })
})
describe("Purchase test", () => {
    it('purchase positive amount and more than stock', async () => {
        const shop: ShopImpl = ShopImpl.create("Tom@gmail.com", "12345-TOM-SAND", "Best local shop in the negev", "Negev", "Tom and sons");
        const user: User = UserImpl.create();
        shop.addItem("Tom@gmail.com", "GTX", "GPU", 1000, ["GPU", "HW"], 1000);
        user.addToBasket(shop.inventory, getNewItem(shop.inventory), 5000);
        const result = await user.purchaseBasket(shop.shop_id, "1234-Israel-Israeli")
        expect(typeof result == "string" && result.includes("doesn't have enough in stock for this purchase")).to.be.true
    });
})