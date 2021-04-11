import { } from "../Users/Register";
import { } from "../Users/Login";
import { } from "../System";
import { expect } from "chai";

describe('Guest:', () => {
    // it('2.1: Enter - enter to the system as a guest', () => {

    // });

    // it('2.2: Exit - exit', () => {

    // });

    it('2.3: Registration - Add a new user to the system.', () => {
        // let reg = register("Test@test.com", "TESTER");
        // expect(reg).to.be.true;
        // expect(System.users.contains("Test@test.com")).to.be.true;
        // reg = register("Test@test.com", "TESTER");
        // expect(reg).to.be.false;
    });

    it('2.4: Login - User success to login', () => {
        // let reg = register("Test@test.com", "TESTER");
        // let user = login("Tester@test.com", "TESTER");
        // expect(user).not.equal(null);
    });

    it('2.5: Information - get info about shop and its products', () => {

    });

    it('2.6: Search - search an item by name', () => {

    });

    it('2.7: Basket - add a produt to the basket', () => {

    });

    it('2.8: Information - get info and edit the shopping basket', () => {

    });

    it('2.9.1: Purchase - buy a specific basket', () => {

    });

    it('2.9.2: Auction - add a bid to an auction', () => {

    });

    it('2.9.3: Auction - credit card charged, product added to purchase history', () => {

    });

    it('2.9.4: Offer -  credit card charged, product added to purchase history', () => {

    });

    it('2.9.5: Offer -  credit card charged, product added to purchase history', () => {

    });

    it('2.9.6: Lottery - credit card charged, product added to purchase history', () => {

    });

    it('2.9.7: Discount - price changed by discount policy', () => {

    });
});

describe('Registered:', () => {
    it('3.1: Logout - user success to logout ', () => {

    });

    it('3.2: Open shop - add a new shop to the system, add the user as original owner', () => {

    });

    it('3.7: Information - get the purchase history', () => {

    });
});

describe('Owner:', () => {
    it('4.1.1: Product - add a new product to the shop', () => {

    });

    it('4.1.2: Product - remove a product from the shop', () => {

    });

    it('4.2.1: Purchase policy - add a new purchase policy to the shop', () => {

    });

    it('4.2.2: Discount policy - add a new discount policy to the shop', () => {

    });

    it('4.2.3: Purchase type - add a new purchase type to the shop', () => {

    });

    it('4.2.4: Discount type - add a new discount type to the shop', () => {

    });

    it('4.3: Appoint - appoint a new owner to the shop', () => {

    });

    it('4.5: Appoint - appoint a new manager to the shop', () => {

    });

    it('4.6: Manager permissions - modify a manager permission', () => {

    });

    it('4.7: Manager - remove a manager from the shop', () => {

    });

    it('4.9: Information - gets every manager and owner in the shop, include their permissions', () => {

    });

    it('4.11: Purchase History - gets a shop purchase history', () => {

    });
});

describe('Admin:', () => {
    it('6.4.1: Information - gets a purchase history of a given user', () => {

    });
});

describe('Services:', () => {
    it('Payment Handler', () => {

    });

    it('Spell Checker', () => {

    });
});