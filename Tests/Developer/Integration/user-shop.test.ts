import {assert, expect} from "chai";
import {ShopImpl} from "../../../Logic/Domain/Shop/Shop";
import {User, UserImpl} from "../../../Logic/Domain/Users/User";
import {ShopInventory} from "../../../Logic/Domain/Shop/ShopInventory";
import {describe} from "mocha";

const getNewItem = (shop: ShopInventory): number => shop.products.reduce((acc, product) => Math.max(product.product_id, acc), -1);

describe('a user purchasing basket from shop', () => {
})

describe("Purchase test", () => {
    it('Two concurrent purchases or item which cause lack to stock', () => {
        const shop: ShopImpl = ShopImpl.create("Tom@gmail.com", "12345-TOM-SAND", "Best local shop in the negev", "Negev", "Tom and sons");
        const user1: User = UserImpl.create();
        const user2: User = UserImpl.create();
        shop.addItem("Tom@gmail.com", "GTX", "GPU", 1000, ["GPU", "HW"], 1000);
        user1.addToBasket(shop.inventory, getNewItem(shop.inventory), 999);
        user2.addToBasket(shop.inventory, getNewItem(shop.inventory), 999);
        user1.purchaseBasket(shop.shop_id,"1234-Israel-Israeli")
            .then(result => {
                expect(typeof result == "string").to.be.false
                user2.purchaseBasket(shop.shop_id,"1234-Israel-Israeli")
                    .then(result => expect(typeof result == "string").to.be.true)
            })
    });
})