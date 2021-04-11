import 'mocha';
import { expect, assert } from 'chai';
import {Shop, ShopImpl} from "../../Logic/Shop/Shop";
import {Product, ProductImpl} from "../../Logic/ProductHandling/Product";

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
    it('Test create shop', () => {
        const shop: Shop = new ShopImpl("tomsand@post.bgu.ac.il", "496351", "best shop in town", "town", "shopie")
        expect(shop.name).to.be.equals("shopie")
        expect(shop.location).to.be.equals("town")
        expect(shop.description).to.be.equals("best shop in town")
        expect(shop.bank_info).to.be.equals("496351")
        expect(shop.management.original_owner.user_email).to.be.equals("tomsand@post.bgu.ac.il")
    })
    it('Test add owner', () => {
        const shop: Shop = new ShopImpl("tomsand@post.bgu.ac.il", "496351", "best shop in town", "town", "shopie")
        let result = shop.appointNewOwner("wrong@mail.com", "new@bgu.ac.il")
        expect(result).to.not.be.equals(true)
        expect(result).to.not.be.equals(false)
        expect(shop.management.owners.filter(o => o.user_email == "new@bgu.ac.il").length == 0).to.be.true
        result = shop.appointNewOwner("tomsand@post.bgu.ac.il", "new@bgu.ac.il")
        expect(result).to.be.equals(true)
        expect(shop.management.owners.filter(o => o.user_email == "new@bgu.ac.il").length == 1).to.be.true
    })

    it('Test add product', () => {
        assert.fail("Test case not implemented")
        /*
        requires policies and discounts
         */
        const p: Product[] = [createProduct(), createProduct()];
        const shop: Shop = new ShopImpl("tomsand@post.bgu.ac.il", "496351", "best shop in town", "town", "shopie")
        // p.forEach(product => shop.addItem("tomsand@post.bgu.ac.il", "Best 29 inch", "Best desc", "1000", ["monitores"],1000, discount_type, purchase_type))
    })
})