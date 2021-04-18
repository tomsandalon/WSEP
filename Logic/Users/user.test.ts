import 'mocha';
import { expect, assert } from 'chai';
import {PasswordHandler} from "./PasswordHandler";
import {RegisterImpl} from "./Register";
import {LoginImpl} from "./Login";
import {StringPair} from "./StringPair";
import {UserImpl} from "./User";
import type = Mocha.utils.type;
import {ShopInventoryImpl} from "../Shop/ShopInventory";
import {ShopManagementImpl} from "../Shop/ShopManagement";

describe('PasswordHandler tests', () => {
    it('should return a hashed password ', () => {
        let handler = PasswordHandler.getInstance();
        expect(handler.hash("password")).to.not.equal("password")
        expect(handler.isHashed(handler.hash("password"))).eq(true)
        expect(handler.isHashed("password")).eq(false)


    });
    it('given a hashed password should return true if its hashed or false if its not ', () => {
        let handler = PasswordHandler.getInstance();
        expect(handler.isHashed(handler.hash("password"))).eq(true)
    });
    it('given a password and hashed value verify if hashed value matches the password ', () => {
        let handler = PasswordHandler.getInstance();
        const hashed1 = handler.hash("123456");
        const hashed2 = handler.hash("123456");
        expect(handler.verify("123456",hashed1)).eq(true);
        expect(handler.verify("123456",hashed2)).eq(true);
        expect(handler.verify("1234567",hashed1)).eq(false);
        expect(handler.verify("12345",hashed2)).eq(false);
    });
});
describe('RegisterImpl tests', () => {
    it('Registering with invalid email format ', () => {
        let value = RegisterImpl.getInstance();
        expect(value.register("liorpev", "123456")).eq(false)
    });
    it('Registering with valid email format ', () => {
        let value = RegisterImpl.getInstance();
        expect(value.register("liorpev@gmail.com", "123456")).eq(true)
    });
    it('Registering with a user email which is already in use ', () => {
        let value = RegisterImpl.getInstance();
        expect(value.register("liorpev1@gmail.com", "123456")).eq(true)
        expect(value.register("liorpev1@gmail.com", "123456")).eq(false)
    });
});




describe('LoginImpl tests', () => {
    it('Registering and trying to login ', () => {
        let reg = RegisterImpl.getInstance();
        reg.register("liorpev@gmail.com","123456");
        let log = LoginImpl.getInstance();
        const user = (log.login("liorpev@gmail.com", "123456"));
        if(typeof user == "string")
            assert.fail()
        else
            expect(user.user_email === "liorpev@gmail.com").eq(true)

    });
    it('Login without register', () => {
        let log = LoginImpl.getInstance();
        const user = (log.login("liorpev15@gmail.com", "123456"));
        expect(typeof user == "string").eq(true)
    });
    it('Register then login and try to login again(first time login) ', () => {
        let value = RegisterImpl.getInstance();
        value.register("liorpev1@gmail.com", "123456");
        let log = LoginImpl.getInstance();
        log.login("liorpev1@gmail.com", "123456");
        expect(typeof (log.login("liorpev1@gmail.com", "123456")) == "string").eq(true);
    });
    it('Register then login and logout then login again(already existing user) ', () => {
        let value = RegisterImpl.getInstance();
        value.register("liorpev2@gmail.com", "123456");
        let log = LoginImpl.getInstance();
        log.login("liorpev2@gmail.com", "123456");
        log.logout("liorpev2@gmail.com")
        const user = (log.login("liorpev2@gmail.com", "123456"));
        if(typeof user == "string")
            assert.fail()
        else
            expect( user.user_email).eq("liorpev2@gmail.com");
    });
    it('Register then login and then logout ', () => {
        let value = RegisterImpl.getInstance();
        value.register("liorpev3@gmail.com", "123456");
        let log = LoginImpl.getInstance();
        log.login("liorpev3@gmail.com", "123456");
        log.logout("liorpev3@gmail.com")
        const values = log.logged_users;
        expect(values.filter(element => element === "liorpev3@gmail.com").length == 0).eq(true);
    });
    it('Register then login and check if the user is in the logged users list ', () => {
        let value = RegisterImpl.getInstance();
        value.register("liorpev4@gmail.com", "123456");
        let log = LoginImpl.getInstance();
        log.login("liorpev4@gmail.com", "123456");
        const values = log.logged_users;
        expect(values.filter(element => element === "liorpev4@gmail.com").length == 0).eq(false);
    });
});


describe('User tests', () => {
    it('Registering login and add item to basket ', () => {
        let reg = RegisterImpl.getInstance();
        reg.register("liorpev@gmail.com","123456");
        let log = LoginImpl.getInstance();
        const user = (log.login("liorpev@gmail.com", "123456"));
        if(typeof user == "string")
            assert.fail()
        else
        {
            let shop = new ShopInventoryImpl(1, new ShopManagementImpl(1, "mark"));
            //(name: string, description: string, amount: number, categories: string[], base_price: number, discount_type: DiscountType, purchase_type: PurchaseType):
            // @ts-ignore
            shop.addItem("vodka","vodka", 100,["drinks"],15,null,null)
            expect(typeof (user.addToBasket(shop, 0,15)) !== "string").eq(true);
        }
    });
    it('Adding item to cart', () => {
        let reg = RegisterImpl.getInstance();
        reg.register("liorpev1@gmail.com","123456");
        let log = LoginImpl.getInstance();
        const user = (log.login("liorpev1@gmail.com", "123456"));
        if(typeof user == "string")
            assert.fail()
        else
        {
            let shop = new ShopInventoryImpl(2, new ShopManagementImpl(2, "mark"));
            //(name: string, description: string, amount: number, categories: string[], base_price: number, discount_type: DiscountType, purchase_type: PurchaseType):
            // @ts-ignore
            shop.addItem("vodka","vodka", 100,["drinks"],15,null,null)
            user.addToBasket(shop,0,50);
            expect(user.cart[0].products[0].product.name === "vodka").eq(true)
            expect(user.cart[0].products[0].amount == 50).eq(true)
            console.log(user.cart[0].products[0].product.product_id)
            // user.editBasketItem(shop,0,15) //TODO editing amount doesnt work?
            // expect(user.cart[0].products[0].amount == 15).eq(true)
            user.removeItemFromBasket(shop,0)
            console.log(user.cart[0].products.length)
            expect(user.cart[0].products.length == 0).eq(true)
            console.log(user.addToBasket(shop,0,50));// TODO removing and adding results in no items? idk
            console.log(user.cart[0].products.length)
        }
    });
});