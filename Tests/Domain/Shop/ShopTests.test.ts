import 'mocha';
import {assert, expect} from 'chai';
import {Shop, ShopImpl} from "../../../Logic/Shop/Shop";
import {ProductImpl} from "../../../Logic/ProductHandling/Product";
import {DiscountType} from "../../../Logic/PurchaseProperties/DiscountType";
import {PurchaseType} from "../../../Logic/PurchaseProperties/PurchaseType";
import {Filter_Type} from "../../../Logic/Shop/ShopInventory";

class SimpleDiscountType implements DiscountType {
    expiration_date: Date;
    percent: number;

    applyDiscount(price: number): number {
        return 0;
    }

    can_be_applied(value: any): boolean {
        return false;
    }

    constructor() {
        this.expiration_date = new Date();
        this.percent = 0;
    }
}

class SimplePurchaseType implements PurchaseType {
    constructor() {
    }
}

const createProduct = () => {
    const temp = ProductImpl.create(1000, "Best 29 inch Monitor", "LG monitor", {});
    if(typeof temp === "string"){
        assert.fail("Failed to created product")
    }
    return temp
};


describe('Correctness Requirements', () => {
    it('4 - Open store must have at least one owner', () => {
        const shop = new ShopImpl("some email", "bank info", "some description",
            "the big city", "The best test shop ever")
        expect(shop.is_active ? shop.management.owners.concat(shop.management.original_owner).length > 0 :
                                    true).to.be.true;
})})

describe('Test Shop', () => {
    it('Test create shop - requirement 3.2', () => {
        const shop: Shop = new ShopImpl("tomsand@post.bgu.ac.il", "496351", "best shop in town", "town", "shopie")
        expect(shop.name).to.be.equals("shopie")
        expect(shop.location).to.be.equals("town")
        expect(shop.description).to.be.equals("best shop in town")
        expect(shop.bank_info).to.be.equals("496351")
        expect(shop.management.original_owner.user_email).to.be.equals("tomsand@post.bgu.ac.il")
    })
    it('Test add owner - requirement 4.3', () => {
        const shop: Shop = new ShopImpl("tomsand@post.bgu.ac.il", "496351", "best shop in town", "town", "shopie")
        let result = shop.appointNewOwner("wrong@mail.com", "new@bgu.ac.il")
        expect(result).to.not.be.equals(true)
        expect(result).to.not.be.equals(false)
        expect(shop.management.owners.filter(o => o.user_email == "new@bgu.ac.il").length == 0).to.be.true
        result = shop.appointNewOwner("tomsand@post.bgu.ac.il", "new@bgu.ac.il")
        expect(result).to.be.equals(true)
        expect(shop.management.owners.filter(o => o.user_email == "new@bgu.ac.il").length == 1).to.be.true
    })

    it('Test add product - requirement 4.1', () => {
        const shop: Shop = new ShopImpl("tomsand@post.bgu.ac.il", "496351", "best shop in town", "town", "shopie")
        expect(shop.getAllItems().length).to.be.eq(0)
        expect(typeof shop.addItem("tomsand@post.bgu.ac.il", "Best 29 inch", "Best desc",
            1000, ["monitors"],1000, new SimpleDiscountType(), new SimplePurchaseType()) === 'boolean').to.be.true
        expect(shop.getAllItems().length).to.be.eq(1)
        expect(typeof shop.addItem("tomsand@post.bgu.ac.il", "Best 29 inch", "Best desc",
            1000, ["monitors"],1000, new SimpleDiscountType(), new SimplePurchaseType()) === 'boolean').to.be.true
        expect(shop.getAllItems().length).to.be.eq(2)
        expect(typeof shop.addItem("tomsand@post.bgu.ac.il", "Best 29 inch", "Best desc",
            1000, ["monitors"],1000, new SimpleDiscountType(), new SimplePurchaseType()) === 'boolean').to.be.true
        expect(shop.getAllItems().length).to.be.eq(3)
    })

    it('Test remove product - requirement 4.1', () => {
        const shop: Shop = new ShopImpl("tomsand@post.bgu.ac.il", "496351", "best shop in town", "town", "shopie")
        expect(shop.getAllItems().length).to.be.eq(0)
        expect(typeof shop.addItem("tomsand@post.bgu.ac.il", "Best 29 inch", "Best desc",
            1000, ["monitors"],1000, new SimpleDiscountType(), new SimplePurchaseType()) === 'boolean').to.be.true
        expect(shop.getAllItems().length).to.be.eq(1)
        expect(typeof shop.addItem("tomsand@post.bgu.ac.il", "Best 29 inch", "Best desc",
            1000, ["monitors"],1000, new SimpleDiscountType(), new SimplePurchaseType()) === 'boolean').to.be.true
        expect(shop.getAllItems().length).to.be.eq(2)
        expect(typeof shop.addItem("tomsand@post.bgu.ac.il", "Best 29 inch", "Best desc",
            1000, ["monitors"],1000, new SimpleDiscountType(), new SimplePurchaseType()) === 'boolean').to.be.true
        expect(shop.getAllItems().length).to.be.eq(3)
    })

    it('Test search - requirement 2.6', () => {
        const shop: Shop = new ShopImpl("tomsand@post.bgu.ac.il", "496351", "best shop in town", "town", "shopie")
        expect(typeof shop.addItem("tomsand@post.bgu.ac.il", "Best 29 centimeter", "Best desc",
            1000, ["monitors"],1000, new SimpleDiscountType(), new SimplePurchaseType()) === 'boolean').to.be.true
        expect(typeof shop.addItem("tomsand@post.bgu.ac.il", "Best 29 inch", "Best desc",
            1000, ["dinosaurs"],1000, new SimpleDiscountType(), new SimplePurchaseType()) === 'boolean').to.be.true
        expect(typeof shop.addItem("tomsand@post.bgu.ac.il", "Best 29 inch", "Not the best desc",
            1000, ["monitors"],1000, new SimpleDiscountType(), new SimplePurchaseType()) === 'boolean').to.be.true
        let result = shop.search("centimeter", undefined, undefined)
        expect(result.length).to.be.eq(1)
        expect(result[0].name).to.be.eq("Best 29 centimeter")
        result = shop.search("29 inch", undefined, undefined)
        expect(result.length).to.be.eq(2)
        expect(result[0].name).to.be.eq("Best 29 inch")
        expect(result[1].name).to.be.eq("Best 29 inch")
        result = shop.search(undefined, "monitors", undefined)
        expect(result.length).to.be.eq(2)
        expect(result[0].category[0].name).to.be.eq("monitors")
        expect(result[1].category[0].name).to.be.eq("monitors")
        result = shop.search(undefined, undefined, "not the best")
        expect(result.length).to.be.eq(1)
        expect(result[0].description).to.be.eq("Not the best desc")
    })

    it('Test filter - requirement 2.6', () => {
        const shop: Shop = new ShopImpl("tomsand@post.bgu.ac.il", "496351", "best shop in town", "town", "shopie")
        expect(typeof shop.addItem("tomsand@post.bgu.ac.il", "Best 29 centimeter", "Best desc",
            1000, ["monitors"],1500, new SimpleDiscountType(), new SimplePurchaseType()) === 'boolean').to.be.true
        expect(typeof shop.addItem("tomsand@post.bgu.ac.il", "Best 29 inch", "Best desc",
            1000, ["dinosaurs"],1000, new SimpleDiscountType(), new SimplePurchaseType()) === 'boolean').to.be.true
        expect(typeof shop.addItem("tomsand@post.bgu.ac.il", "Best 29 inch", "Not the best desc",
            1000, ["monitors"],500, new SimpleDiscountType(), new SimplePurchaseType()) === 'boolean').to.be.true
        let products = shop.getAllItems()
        let result = shop.filter(products, [{filter_type: Filter_Type.AbovePrice, filter_value: "999"}])
        expect(result.length).to.be.eq(2)
        expect(result.some(r => r.base_price < 999)).to.be.false
        products = shop.getAllItems()
        result = shop.filter(products, [{filter_type: Filter_Type.AbovePrice, filter_value: "999"}, {filter_type: Filter_Type.BelowPrice, filter_value: "1001"}])
        expect(result.length).to.be.eq(1)
        expect(result.some(r => r.base_price != 1000)).to.be.false
    })
})