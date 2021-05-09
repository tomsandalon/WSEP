import 'mocha';
import {assert, expect} from 'chai';
import {Shop, ShopImpl} from "../../../Logic/Domain/Shop/Shop";
import {ProductImpl} from "../../../Logic/Domain/ProductHandling/Product";
// import {PurchaseType} from "../../../Logic/Domain/PurchaseProperties/PurchaseType";
import {Filter_Type, Purchase_Type} from "../../../Logic/Domain/Shop/ShopInventory";
import {Action} from "../../../Logic/Domain/ShopPersonnel/Permissions";


const createProduct = () => {
    const temp = ProductImpl.create(1000, "Best 29 inch Monitor", "LG monitor", Purchase_Type.Immediate);
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

    it('Test add product - requirement 4.1', () => {
        const shop: Shop = new ShopImpl("tomsand@post.bgu.ac.il", "496351", "best shop in town", "town", "shopie")
        expect(shop.getAllItems().length).to.be.eq(0)
        expect(typeof shop.addItem("tomsand@post.bgu.ac.il", "Best 29 inch", "Best desc",
            1000, ["monitors"],1000,  Purchase_Type.Immediate) === 'boolean').to.be.true
        expect(shop.getAllItems().length).to.be.eq(1)
        expect(typeof shop.addItem("tomsand@post.bgu.ac.il", "Best 29 inch", "Best desc",
            1000, ["monitors"],1000,  Purchase_Type.Immediate) === 'boolean').to.be.true
        expect(shop.getAllItems().length).to.be.eq(2)
        expect(typeof shop.addItem("tomsand@post.bgu.ac.il", "Best 29 inch", "Best desc",
            1000, ["monitors"],1000,  Purchase_Type.Immediate) === 'boolean').to.be.true
        expect(shop.getAllItems().length).to.be.eq(3)
    })

    it('Test remove product - requirement 4.1', () => {
        const shop: Shop = new ShopImpl("tomsand@post.bgu.ac.il", "496351", "best shop in town", "town", "shopie")
        expect(shop.getAllItems().length).to.be.eq(0)
        expect(typeof shop.addItem("tomsand@post.bgu.ac.il", "Best 29 inch", "Best desc",
            1000, ["monitors"],1000,  Purchase_Type.Immediate) === 'boolean').to.be.true
        expect(shop.getAllItems().length).to.be.eq(1)
        const productId = shop.inventory.products.map(p => p.product_id).reduce((acc, cur) => Math.max(acc, cur), -1)
        expect(typeof shop.removeItem("tomsand@post.bgu.ac.il", productId) == "boolean").to.be.true
        expect(shop.getAllItems().length).to.be.eq(0)
    })

    it('Test search - requirement 2.6', () => {
        const shop: Shop = new ShopImpl("tomsand@post.bgu.ac.il", "496351", "best shop in town", "town", "shopie")
        expect(typeof shop.addItem("tomsand@post.bgu.ac.il", "Best 29 centimeter", "Best desc",
            1000, ["monitors"],1000,  Purchase_Type.Immediate) === 'boolean').to.be.true
        expect(typeof shop.addItem("tomsand@post.bgu.ac.il", "Best 29 inch", "Best desc",
            1000, ["dinosaurs"],1000,  Purchase_Type.Immediate) === 'boolean').to.be.true
        expect(typeof shop.addItem("tomsand@post.bgu.ac.il", "Best 29 inch", "Not the best desc",
            1000, ["monitors"],1000,  Purchase_Type.Immediate) === 'boolean').to.be.true
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
            1000, ["monitors"],1500,  Purchase_Type.Immediate) === 'boolean').to.be.true
        expect(typeof shop.addItem("tomsand@post.bgu.ac.il", "Best 29 inch", "Best desc",
            1000, ["dinosaurs"],1000,  Purchase_Type.Immediate) === 'boolean').to.be.true
        expect(typeof shop.addItem("tomsand@post.bgu.ac.il", "Best 29 inch", "Not the best desc",
            1000, ["monitors"],500,  Purchase_Type.Immediate) === 'boolean').to.be.true
        let products = shop.getAllItems()
        let result = shop.filter(products, [{filter_type: Filter_Type.AbovePrice, filter_value: "999"}])
        expect(result.length).to.be.eq(2)
        expect(result.some(r => r.price < 999)).to.be.false
        products = shop.getAllItems()
        result = shop.filter(products, [{filter_type: Filter_Type.AbovePrice, filter_value: "999"}, {filter_type: Filter_Type.BelowPrice, filter_value: "1001"}])
        expect(result.length).to.be.eq(1)
        expect(result.some(r => r.price != 1000)).to.be.false
    })

    it('Test add owner - requirement 4.3', () => {
        const shop: Shop = new ShopImpl("tomsand@post.bgu.ac.il", "496351", "best shop in town", "town", "shopie")
        let result = shop.appointNewOwner("wrong@mail.com", "new@bgu.ac.il")
        expect(typeof result == "string").to.be.true
        expect(shop.management.owners.some(o => o.user_email == "new@bgu.ac.il")).to.be.false
        result = shop.appointNewOwner("tomsand@post.bgu.ac.il", "new@bgu.ac.il")
        expect(result).to.be.equals(true)
        expect(shop.management.owners.filter(o => o.user_email == "new@bgu.ac.il").length == 1).to.be.true
    })

    it('Test add manager - requirement 4.5', () => {
        const shop: Shop = new ShopImpl("tomsand@post.bgu.ac.il", "496351", "best shop in town", "town", "shopie")
        let result = shop.appointNewManager("wrong@mail.com", "new@bgu.ac.il")
        expect(typeof result == "string").to.be.true
        shop.appointNewOwner("tomsand@post.bgu.ac.il", "owner@bgu.ac.il")
        expect(shop.management.managers.some(o => o.user_email == "new@bgu.ac.il")).to.be.false
        result = shop.appointNewManager("owner@bgu.ac.il", "new@bgu.ac.il")
        expect(result).to.be.equals(true)
        expect(shop.management.managers.filter(o => o.user_email == "new@bgu.ac.il").length == 1).to.be.true
        result = shop.appointNewManager("tomsand@post.bgu.ac.il", "new@bgu.ac.il")
        expect(typeof result == "string").to.be.true
        expect(shop.management.managers.filter(o => o.user_email == "new@bgu.ac.il").length == 1).to.be.true;
    })

    it('Test edit manager permissions - requirement 4.6', () => {
        const shop: Shop = new ShopImpl("tomsand@post.bgu.ac.il", "496351", "best shop in town", "town", "shopie")
        shop.appointNewOwner("tomsand@post.bgu.ac.il", "owner@bgu.ac.il")
        shop.appointNewManager("tomsand@post.bgu.ac.il", "manager@bgu.ac.il")
        shop.appointNewManager("owner@bgu.ac.il", "anothermanager@bgu.ac.il")
        let result = shop.addPermissions("tomsand@post.bgu.ac.il", "anothermanager@bgu.ac.il", [Action.AddItem])
        expect(typeof result == "string").to.be.true
        result = shop.addPermissions("tomsand@post.bgu.ac.il", "manager@bgu.ac.il", [Action.AddItem])
        expect(typeof result == "string").to.be.false
        result = shop.addPermissions("owner@bgu.ac.il", "anothermanager@bgu.ac.il", [Action.RemoveItem])
        expect(typeof result == "string").to.be.false
        expect(typeof shop.addItem("manager@bgu.ac.il", "Best 29 inch", "Not the best desc",
            1000, ["monitors"],500,  Purchase_Type.Immediate) === 'boolean').to.be.true
        const productId = shop.inventory.products.map(p => p.product_id).reduce((acc, cur) => Math.max(acc, cur), -1)
        expect(typeof shop.removeItem("anothermanager@bgu.ac.il", productId) == "boolean").to.be.true
        expect(shop.getAllItems().length).to.be.eq(0)
    })

    it('Test remove manager - requirement 4.7', () => {
        const shop: Shop = new ShopImpl("tomsand@post.bgu.ac.il", "496351", "best shop in town", "town", "shopie")
        shop.appointNewOwner("tomsand@post.bgu.ac.il", "owner@bgu.ac.il")
        shop.appointNewManager("tomsand@post.bgu.ac.il", "manager@bgu.ac.il")
        shop.appointNewManager("owner@bgu.ac.il", "anothermanager@bgu.ac.il")
        let number_of_managers = shop.management.managers.length
        //bad scenario
        expect(typeof shop.removeManager("owner@bgu.ac.il", "manager@bgu.ac.il") == "string").to.be.true
        expect(typeof shop.removeManager("tomsand@post.bgu.ac.il", "anothermanager@bgu.ac.il") == "string").to.be.true
        //good scenario
        expect(typeof shop.removeManager("owner@bgu.ac.il", "anothermanager@bgu.ac.il") == "string").to.be.false
        expect(typeof shop.removeManager("tomsand@post.bgu.ac.il", "manager@bgu.ac.il") == "string").to.be.false
        expect(shop.management.managers.length).to.be.eq(number_of_managers - 2)
    })

    it('Test remove manager - requirement 4.9', () => {
        const shop: Shop = new ShopImpl("tomsand@post.bgu.ac.il", "496351", "best shop in town", "town", "shopie")
        expect(typeof shop.getStaffInfo("wrong@post.bgu.ac.il") == "string").to.be.true
        expect(typeof shop.getStaffInfo("tomsand@post.bgu.ac.il") == "string").to.be.false
    })
})