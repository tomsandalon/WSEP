import 'mocha';
import {assert, expect} from 'chai';
import {Authentication} from "../../../../Logic/Domain/Users/Authentication";
import {RegisterImpl} from "../../../../Logic/Domain/Users/Register";
import {LoginImpl} from "../../../../Logic/Domain/Users/Login";
import {ShopInventoryImpl} from "../../../../Logic/Domain/Shop/ShopInventory";
import {ShopManagementImpl} from "../../../../Logic/Domain/Shop/ShopManagement";
import {ProductImpl} from "../../../../Logic/Domain/ProductHandling/Product";
import {SystemImpl} from "../../../../Logic/Domain/System";
import {id_counter} from "../../../../Logic/Domain/Users/User";

describe('Authentication Tests', () => {
    it('should return a hashed password ', () => {
        let handler = Authentication.getInstance();
        expect(handler.hash("password")).to.not.equal("password")
        expect(handler.isHashed(handler.hash("password"))).eq(true)
        expect(handler.isHashed("password")).eq(false)


    });
    it('given a hashed password should return true if its hashed or false if its not ', () => {
        let handler = Authentication.getInstance();
        expect(handler.isHashed(handler.hash("password"))).eq(true)
    });
    it('given a password and hashed value verify if hashed value matches the password ', () => {
        let handler = Authentication.getInstance();
        const hashed1 = handler.hash("123456");
        const hashed2 = handler.hash("123456");
        expect(handler.verify("123456",hashed1)).eq(true);
        expect(handler.verify("123456",hashed2)).eq(true);
        expect(handler.verify("1234567",hashed1)).eq(false);
        expect(handler.verify("12345",hashed2)).eq(false);
    });
});
describe('RegisterImpl Tests', () => {
    it('Registering with invalid email format ', () => {
        let value = RegisterImpl.getInstance();
        expect(value.register("liorpev", "123456")).eq(false)
    });
    it('Registering with valid email format ', () => {
        let value = RegisterImpl.getInstance();
        expect(value.register("liorpev123456@gmail.com", "123456")).eq(true)
    });
    it('Registering with a user email which is already in use ', () => {
        let value = RegisterImpl.getInstance();
        expect(value.register("liorpev1234@gmail.com", "123456")).eq(true)
        expect(value.register("liorpev1234@gmail.com", "123456")).eq(false)
    });
});




describe('LoginImpl Tests', () => {
    it('Registering and trying to login ', () => {
        let reg = RegisterImpl.getInstance();
        reg.register("liorpev@gmail.com","123456");
        let log = LoginImpl.getInstance();
        const user = (log.login("liorpev@gmail.com", "123456"));
        if(typeof user == "string")
            assert.fail()
        else
            { // @ts-ignore
                const value = log.retrieveUser(user);
                if(typeof value == "string")
                    assert.fail()
                expect(value.user_email === "liorpev@gmail.com").eq(true)
            }

    });
    it('Login without register', () => {
        let log = LoginImpl.getInstance();
        const user = (log.login("liorpev15@gmail.com", "123456"));
        expect(typeof user == "string").eq(true)
    });
    it('Register then login and try to login again(first time login) ', () => {
        let value = RegisterImpl.getInstance();
        value.register("liorpev1999@gmail.com", "123456");
        let log = LoginImpl.getInstance();
        log.login("liorpev1999@gmail.com", "123456");
        expect(typeof (log.login("liorpev1999@gmail.com", "123456")) == "string").eq(true);
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
        else {
            const logged_user = log.retrieveUser(user);
            if(typeof logged_user == "string")
                assert.fail()
            expect(logged_user.user_email).eq("liorpev2@gmail.com");
        }
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

describe('Guest testing', () => {
    SystemImpl.getInstance(true)
    it('creating 5 guests ', () => {
        let log = LoginImpl.getInstance();
        log.guestLogin();
        log.guestLogin();
        log.guestLogin();
        log.guestLogin();
        log.guestLogin();
        expect(log.logged_guests.length == 5).eq(true)
        log.exit(id_counter - 1)
        expect(log.logged_guests.length).to.be.eq(4)
        expect(log.logged_guests.filter(val => val == 1).length ==0).eq(true)
    });
    it('creating 1 guest and buying stuff ', () => {
        let log = LoginImpl.getInstance();
        log.guestLogin();
        const user = log.retrieveUser(id_counter - 1);
        if(typeof user ==  "string")
            assert.fail()
        expect(user.user_email == "" && user.password == "").eq(true)
        let shop = new ShopInventoryImpl(1, new ShopManagementImpl(1, "mark"),"hey","nye");
        //(name: string, description: string, amount: number, categories: string[], base_price: number, discount_type: DiscountType, purchase_type: PurchaseType):
        // @ts-ignore
        shop.addItem("vodka","vodka", 100,["drinks"],15,null,null)
        expect(typeof (user.addToBasket(shop, ProductImpl._product_id_specifier - 1,15)) !== "string").eq(true);
        expect(user.cart[0].products[0].amount == 15).eq(true)
    });
});

describe('User Tests', () => {
    SystemImpl.getInstance(true)

    it('Registering login and add item to basket ', () => {
        let reg = RegisterImpl.getInstance();
        let log = LoginImpl.getInstance();
        reg.register("liorpev1888@gmail.com","123456");
        const user = (log.login("liorpev1888@gmail.com", "123456"));
        if(typeof user == "string")
            assert.fail()
        else
        {
            let shop = new ShopInventoryImpl(1, new ShopManagementImpl(1, "mark"),"hey","ney");
            //(name: string, description: string, amount: number, categories: string[], base_price: number, discount_type: DiscountType, purchase_type: PurchaseType):
            // @ts-ignore
            shop.addItem("vodka","vodka", 100,["drinks"],15,null,null)
            const logged_user = log.retrieveUser(user);
            if(typeof logged_user == "string")
                assert.fail()
            expect(typeof (logged_user.addToBasket(shop, ProductImpl._product_id_specifier - 1,15)) !== "string").eq(true);
        }
    });
    SystemImpl.getInstance(true)

    it('Adding item to cart', () => {
        ProductImpl.resetIDs();
        let reg = RegisterImpl.getInstance();
        reg.register("liorpev2123123123@gmail.com","123456");
        let log = LoginImpl.getInstance();
        const user = (log.login("liorpev2123123123@gmail.com", "123456"));
        if(typeof user == "string")
            assert.fail()
        else
        {
            let shop = new ShopInventoryImpl(2, new ShopManagementImpl(2, "mark"),"hey","nye");
            //(name: string, description: string, amount: number, categories: string[], base_price: number, discount_type: DiscountType, purchase_type: PurchaseType):
            // @ts-ignore
            shop.addItem("vodka","vodka", 100,["drinks"],15,null,null)
            const logged_user = log.retrieveUser(user);
            if(typeof logged_user == "string")
                assert.fail()
            logged_user.addToBasket(shop,ProductImpl._product_id_specifier - 1,50);
            expect(logged_user.cart[0].products[0].product.name === "vodka").eq(true)
            expect(logged_user.cart[0].products[0].amount == 50).eq(true)
            logged_user.editBasketItem(shop,0,15)
            expect(logged_user.cart[0].products[0].amount == 15).eq(true)
            logged_user.removeItemFromBasket(shop,0)
            expect(logged_user.cart[0].products.length == 0).eq(true)
            let val  = logged_user.addToBasket(shop,0,50)
            expect(logged_user.cart[0].products[0].product.name === "vodka").eq(true)
            expect(logged_user.cart[0].products[0].amount == 50).eq(true)
        }
    });
    SystemImpl.getInstance(true)

    describe('Purchase tests', () => {
        it('Purchase basket', () => {
            let reg = RegisterImpl.getInstance();
            reg.register("liorpev3@gmail.com","123456");
            let log = LoginImpl.getInstance();
            const user = (log.login("liorpev3@gmail.com", "123456"));
            if(typeof user == "string")
                assert.fail()
            else
            {
                let shop = new ShopInventoryImpl(1, new ShopManagementImpl(1, "mark"),"hey","ney");
                //(name: string, description: string, amount: number, categories: string[], base_price: number, discount_type: DiscountType, purchase_type: PurchaseType):
                // @ts-ignore
                shop.addItem("vodka","vodka", 100,["drinks"],15,null,null)
                const logged_user = log.retrieveUser(user);
                if(typeof logged_user == "string")
                    assert.fail()
                expect(typeof (logged_user.addToBasket(shop, ProductImpl._product_id_specifier - 1,15)) !== "string").eq(true);
                const purchase =logged_user.purchaseBasket(1, "paying");
                if(typeof purchase == "string"){
                    assert.fail()
                }
                expect(logged_user.cart.length == 0).is.eq(true); //no baskets after purchase
                const history = logged_user.getOrderHistory();
                if(typeof history == "string")
                    assert.fail()
                expect(history[0].includes("vodka")).is.eq(true); // order history exists.
            }
        });
    });
    SystemImpl.getInstance(true)

    describe('Purchase cart', () => {
        it('Purchase cart', () => {
            let reg = RegisterImpl.getInstance();
            reg.register("cftvgbuhnjimkolpkmkonijhbu@gmail.com","123456");
            let log = LoginImpl.getInstance();
            const user = (log.login("cftvgbuhnjimkolpkmkonijhbu@gmail.com", "123456"));
            if(typeof user == "string")
                assert.fail()
            else
            {
                let shop = new ShopInventoryImpl(1, new ShopManagementImpl(1, "mark"),"hey","ney");
                //(name: string, description: string, amount: number, categories: string[], base_price: number, discount_type: DiscountType, purchase_type: PurchaseType):
                // @ts-ignore
                shop.addItem("vodka","vodka", 100,["drinks"],15,null,null)
                let shop2 = new ShopInventoryImpl(2, new ShopManagementImpl(2, "mark"),"hey","ney");
                //(name: string, description: string, amount: number, categories: string[], base_price: number, discount_type: DiscountType, purchase_type: PurchaseType):
                // @ts-ignore
                shop2.addItem("banana","banana", 100,["food"],15,null,null)
                const logged_user = log.retrieveUser(user);
                if(typeof logged_user == "string")
                    assert.fail()
                expect(typeof (logged_user.addToBasket(shop, ProductImpl._product_id_specifier - 2,15)) !== "string").eq(true);
                expect(typeof (logged_user.addToBasket(shop2, ProductImpl._product_id_specifier - 1,15)) !== "string").eq(true);
                const purchase =logged_user.purchaseBasket(1, "paying");
                const purchase2 =logged_user.purchaseBasket(2, "paying");
                if(typeof purchase == "string" || typeof  purchase2 == "string"){
                    assert.fail()
                }
                expect(logged_user.cart.length == 0).is.eq(true); //no baskets after purchase
                const history = logged_user.getOrderHistory();
                if(typeof history == "string")
                    assert.fail()
                expect(history[0].includes("vodka")).is.eq(true); // order history exists.
                expect(history[1].includes("banana")).is.eq(true); // cart purchase
            }
        });
    });
    });