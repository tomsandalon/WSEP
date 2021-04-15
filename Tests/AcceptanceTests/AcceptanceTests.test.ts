import { } from "../../Logic/Users/Register";
import { } from "../../Logic/Users/Login";
import { expect, assert} from "chai";
import {SystemDriver} from "./SystemDriver";
import {System} from "./System";
import symbols = Mocha.reporters.Base.symbols;
import {Action} from "../../Logic/ShopPersonnel/Permissions";

describe('Guest:', () => {
    it('2.1: Enter - enter to the system as a guest', () => {
        const system: System = SystemDriver.getSystem(true);
        system.openSession();
    });

    it('2.2: Exit - exit', () => {
        const system: System = SystemDriver.getSystem(true);
        system.closeSession();
    });

    it('2.3: Registration - Add a new user to the system.', () => {
        const system: System = SystemDriver.getSystem(true);
        let reg = system.performRegister("Test@test.com", "TESTER"); //good
        expect(reg).to.be.true;
        let sad_reg = system.performRegister("Test@test.com","blabla"); // sad
        expect(sad_reg).to.be.false;
        let bad_reg = system.performRegister("",""); //bad
        expect(bad_reg).to.be.false
    });

    it('2.4: Login - User success to login', () => {
        const system: System = SystemDriver.getSystem(true);
        let reg = system.performRegister("Test@test.com", "TESTER");
        expect(reg).to.be.true;
        let user = system.performLogin("Test@test.com", "TESTER");
        expect(typeof user == "number").to.be.true; //good
        let sad_user = system.performLogin("Test@test.com","test")
        expect(typeof sad_user == "string").to.be.true; // sad
        let bad_user = system.performLogin("321321321321321312312312312312312312", "1232132131232132123213213")
        expect(typeof bad_user == "string").to.be.true
    });

    it('2.5: Information - get info about shop and its products', () => {
        //TODO
    });

    it('2.6: Search - search an item by name and get all the shops that sells it', () => {
        //TODO
    });

    it('2.7: Basket - add a produt to the basket', () => {
        const system: System = SystemDriver.getSystem(true);
        system.performRegister("Test@test.com", "TESTER");
        let originOwner = system.performLogin("Test@test.com", "TESTER") as number
        let shopID = system.addShop(originOwner as number, "TestShop", "shop for tests", "Beer Sheva", "En li kesef") as number
        system.addProduct(originOwner, shopID,"TV", "Best desc", 1000, ["monitors"],1000, { expiration_date: new Date(), percent: 0, applyDiscount(price: number): number { return 0; }, can_be_applied(value: any): boolean { return false;  } }, {} )
        system.performRegister("newUser@test.com", "TESTER");
        let user = system.performLogin("newUser@test.com", "TESTER") as number
        let add_to_basket = system.addItemToBasket(user, 0, shopID, 500)
        expect(typeof add_to_basket == "string").to.be.false //good test
        let sad_add = system.addItemToBasket(user, 0, shopID, 1500);
        expect(typeof sad_add == "string").to.be.true // sad test // TODO how can i add more items amount than available amount in shop
        let bad_add = system.addItemToBasket(user, 0, shopID, -150);
        expect(typeof  bad_add == "string").to.be.true // bad test

    });

    it('2.8: Information - get info and edit the shopping basket', () => {
        const system: System = SystemDriver.getSystem(true);
        system.performRegister("Test@test.com", "TESTER");
        let originOwner = system.performLogin("Test@test.com", "TESTER") as number
        let shopID = system.addShop(originOwner as number, "TestShop", "shop for tests", "Beer Sheva", "En li kesef") as number
        system.addProduct(originOwner, shopID,"TV", "Best desc", 10000, ["monitors"],1000, { expiration_date: new Date(), percent: 0, applyDiscount(price: number): number { return 0; }, can_be_applied(value: any): boolean { return false;  } }, {} )
        system.performRegister("newUser@test.com", "TESTER");
        let user = system.performLogin("newUser@test.com", "TESTER") as number
        let add_to_basket = system.addItemToBasket(user, 0, shopID, 500)
        expect(typeof add_to_basket == "string").to.be.false
        system.editShoppingCart(user, shopID, 0, 9999)
        let cart_info = system.displayShoppingCart(user) as string[][]
        expect(cart_info[0][0].includes("9999")).to.be.true // good
        let sad_edit = system.editShoppingCart(user , 150, 0, 9999);
        expect(typeof sad_edit == "string").to.be.true; //sad
        let bad_edit = system.editShoppingCart(user,150,-125, -21321);
        expect(typeof bad_edit == "string").to.be.true // bad
    });

    it('2.9.1: Purchase - buy a specific basket', () => {
        const system: System = SystemDriver.getSystem(true);
        system.performRegister("Test@test.com", "TESTER");
        let originOwner = system.performLogin("Test@test.com", "TESTER") as number
        let shopID = system.addShop(originOwner as number, "TestShop", "shop for tests", "Beer Sheva", "En li kesef") as number
        system.addProduct(originOwner, shopID,"TV", "Best desc", 1000, ["monitors"],1000, { expiration_date: new Date(), percent: 0, applyDiscount(price: number): number { return 0; }, can_be_applied(value: any): boolean { return false;  } }, {} )
        system.performRegister("newUser@test.com", "TESTER");
        let user = system.performLogin("newUser@test.com", "TESTER") as number
        let add_to_basket = system.addItemToBasket(user, 0, shopID, 500)
        expect(typeof add_to_basket == "string").to.be.false
        let purchase = system.purchaseShoppingBasket(user, shopID, "hello")
        expect(typeof purchase == "boolean").to.be.true // good
        let sad_purchase = system.purchaseShoppingBasket(user, 152, "hello");
        expect(sad_purchase).to.be.false// sad
        let bad_purchase = system.purchaseShoppingBasket(-150, 152, "hello");
        expect(typeof bad_purchase == "string").to.be.true // bad
    });

    it('2.9.2: Auction - add a bid to an auction', () => {
        //TODO Milestone 2

        // expect(shop.addBid(productID, amount, paymentInfo)).to.be.true;
        // expect(shop.addBid(productID, lowerAmount, paymentInfo)).to.be.false;
    });

    it('2.9.3: Auction - credit card charged, product added to purchase history', () => {
        //TODO Milestone 2

        //let balance = service.paymentService.getBalance();
        //shop.addBid(productID, amount, paymentInfo);
        //expect(service.paymentBalance.getBalance()).equal(balance - amount);
        //expect(user.getPurchaseHistory().contains(productID)).to.be.true;
        //let balance = service.paymentService.getBalance();
        //shop.addBid(productID, amount, wrongPaymentInfo);
        //expect(service.paymentBalance.getBalance()).equal(balance);
        //expect(user.getPurchaseHistory().contains(productID)).to.be.false;
    });

    it('2.9.4: Offer -  credit card charged, product added to purchase history', () => {
        //TODO Milestone 2

        //let balance = service.paymentService.getBalance();
        //shop.sendOffer(productID, amount, offer, paymentInfo); //manager accepts
        //expect(service.paymentBalance.getBalance()).equal(balance - offer);
        //expect(user.getPurchaseHistory().contains(productID)).to.be.true;
        //let balance = service.paymentService.getBalance();
        //shop.sendOffer(productID, amount, offer, paymentInfo); //manager declines
        //expect(service.paymentBalance.getBalance()).equal(balance);
        //expect(user.getPurchaseHistory().contains(productID)).to.be.false;
    });

    it('2.9.5: Lottery -  choose random winner, credit card charged, product added to purchase history', () => {
        //TODO Milestone 2

        //assuming user submmision reach the goal price and the user is the winner
        //let balance = service.paymentService.getBalance();
        //shop.buyLotteryTicket(productID, submission);
        //expect(service.paymentBalance.getBalance()).equal(balance - submission);
        //expect(user.getPurchaseHistory().contains(productID)).to.be.true;
        //expect(shop.buyLotteryTicket(productID, largeSubmission)).to.be.false; //sad path ?? 
        //expect(shop.buyLotteryTicket(productID, largeSubmission)).to.be.false; //item removed = bad path ?? 
    });

    it('2.9.6: Lottery - credit card charged, product added to purchase history', () => {
        //TODO Milestone 2
        //the difference from 2.9.5?
    });

    it('2.9.7: Discount - price changed by discount policy', () => {
        //TODO Milestone 2

        //expect(shop.getDiscountedPrice(productID)).not.equal(shop.getPrice(productID));
    });
});

describe('Registered:', () => {
    it('3.1: Logout - user success to logout ', () => {
        const system: System = SystemDriver.getSystem(true);
        let reg = system.performRegister("Test@test.com", "TESTER");
        let user = system.performLogin("Test@test.com", "TESTER");
        expect(typeof user == "string").to.be.false
        system.logout("Test@test.com")//good
        assert(true)
        //TODO expand test when connection handler is implemented
    });

    it('3.2: Open shop - add a new shop to the system, add the user as original owner', () => {
        const system: System = SystemDriver.getSystem(true);
        let reg = system.performRegister("Test@test.com", "TESTER");
        let user = system.performLogin("Test@test.com", "TESTER");
        let shopID = system.addShop(user as number, "TestShop", "shop for tests", "Beer Sheva", "En li kesef");
        expect(typeof shopID == "number").to.be.true
        expect( typeof (system.getShopInfo(shopID as number)) == "string").to.be.false
        expect(system.getShopInfo(shopID as number)[0].includes("Test@test.com")).to.be.true // good
        let sad_shopID = system.addShop(user as number, "", "shop for tests", "Beer Sheva", "En li kesef");
        expect(typeof sad_shopID == "string").to.be.true // sad //TODO empty name is legal? fix it.
        let bad_shopID = system.addShop(user as number, "", "", "", "");
        expect(typeof bad_shopID == "string").to.be.true //bad TODO all fields empty is legal? fix it

    });

    it('3.7: Information - get the purchase history', () => {
        const system: System = SystemDriver.getSystem(true);
        system.performRegister("Test@test.com", "TESTER");
        let originOwner = system.performLogin("Test@test.com", "TESTER") as number
        let shopID = system.addShop(originOwner as number, "TestShop", "shop for tests", "Beer Sheva", "En li kesef") as number
        system.addProduct(originOwner, shopID,"TV", "Best desc", 1000, ["monitors"],1000, { expiration_date: new Date(), percent: 0, applyDiscount(price: number): number { return 0; }, can_be_applied(value: any): boolean { return false;  } }, {} )
        system.performRegister("newUser@test.com", "TESTER");
        let user = system.performLogin("newUser@test.com", "TESTER") as number
        system.addItemToBasket(user, 0, shopID, 500)
        let result = system.userOrderHistory(user) as string[]
        expect(result[0]).to.be.eq("Empty order history") //sad
        system.purchaseShoppingBasket(user, shopID, "hello")
        result = system.userOrderHistory(user) as string[]
        expect(result[0]).to.be.not.eq("Empty order history")
        expect(result[0].includes("TV")).to.be.true // good
    });
});

describe('Owner:', () => {
    it('4.1.1: Product - add a new product to the shop', () => {
        const system: System = SystemDriver.getSystem(true);
        let reg = system.performRegister("Test@test.com", "TESTER");
        let userID = system.performLogin("Test@test.com", "TESTER") as number
        let shopID = system.addShop(userID as number, "TestShop", "shop for tests", "Beer Sheva", "En li kesef") as number
        let items = system.getItemsFromShop(shopID) as string[]
        expect(items.some(p=>p.includes("TV"))).to.be.false
        const res = system.addProduct(userID, shopID,"TV", "Best desc", 1000, ["monitors"],1000, { expiration_date: new Date(), percent: 0, applyDiscount(price: number): number { return 0; }, can_be_applied(value: any): boolean { return false;  } }, {} )
        expect(typeof res == "boolean").to.be.true
        items = system.getItemsFromShop(shopID) as string[]
        expect(items.some(p=>p.includes("TV"))).to.be.true //good
        const sad_res = system.addProduct(userID, shopID,"", "Best desc", 1000, ["monitors"],1000, { expiration_date: new Date(), percent: 0, applyDiscount(price: number): number { return 0; }, can_be_applied(value: any): boolean { return false;  } }, {} )
        expect(typeof sad_res == "string").to.be.true // sad
        let guest = system.performGuestLogin();
        const bad_res = system.addProduct(guest, shopID,"TV", "Best desc", 1000, ["monitors"],1000, { expiration_date: new Date(), percent: 0, applyDiscount(price: number): number { return 0; }, can_be_applied(value: any): boolean { return false;  } }, {} )
        expect(typeof bad_res == "string").to.be.true // bad

    });

    it('4.1.2: Product - remove a product from the shop', () => {
        const system: System = SystemDriver.getSystem(true);
        let reg = system.performRegister("Test@test.com", "TESTER");
        let userID = system.performLogin("Test@test.com", "TESTER") as number
        let shopID = system.addShop(userID as number, "TestShop", "shop for tests", "Beer Sheva", "En li kesef") as number
        let res = system.addProduct(userID, shopID,"TV", "Best desc", 1000, ["monitors"],1000, { expiration_date: new Date(), percent: 0, applyDiscount(price: number): number { return 0; }, can_be_applied(value: any): boolean { return false;  } }, {} )
        let items = system.getItemsFromShop(shopID) as string[]
        expect(items.some(p=>p.includes("TV"))).to.be.true
        //FIXME: remove product needs productID, how to get the id.
        expect((system.getItemsFromShop(shopID) as string[]).some(p=>p.includes("TV"))).to.be.false
        //TODO SAD/BAD
    });

    it('4.2.1: Purchase policy - add a new purchase policy to the shop', () => {
        //user is an owner
        //expect(Shop.addPolicy(policy)).to.be.true;
        //expect(Shop.addPolicy(wrongPolicy)).to.be.false;
        //not an owner
        //expect(Shop.addPolicy(policy)).to.be.false;
    });

    it('4.2.2: Discount policy - add a new discount policy to the shop', () => {
        //user is an owner
        //expect(Shop.addPolicy(policy)).to.be.true;
        //expect(Shop.addPolicy(wrongPolicy)).to.be.false;
        //not an owner
        //expect(Shop.addPolicy(policy)).to.be.false;
    });

    it('4.2.3: Purchase type - add a new purchase type to the shop', () => {
        //user is an owner
        //expect(Shop.addPurchaseType(purchaseType)).to.be.true;
        //expect(Shop.addPurchaseType(purchaseType)).to.be.false;//already exists
        //not an owner
        //expect(Shop.addPurchseType(purchaseType)).to.be.false;
    });

    it('4.2.4: Discount type - add a new discount type to the shop', () => {
        //user is an owner
        //expect(Shop.addDiscountType(DiscountType)).to.be.true;
        //expect(Shop.addDiscountType(DiscountType)).to.be.false;//already exists
        //not an owner
        //expect(Shop.addDiscountType(discountType)).to.be.false;
    });

    it('4.3: Appoint - appoint a new owner to the shop', () => {
        const system: System = SystemDriver.getSystem(true);
        //Original owner
        let reg = system.performRegister("Test@test.com", "TESTER");
        let userID = system.performLogin("Test@test.com", "TESTER") as number
        let shopID = system.addShop(userID as number, "TestShop", "shop for tests", "Beer Sheva", "En li kesef") as number
        //create new employee
        let newEmp = system.performRegister("OvedMetzuyan@post.co.il", "123")
        let nEmpID = system.performLogin("OvedMetzuyan@post.co.il", "123") as number
        let res = system.addProduct(nEmpID, shopID,"TV", "Best desc", 1000, ["monitors"],1000, { expiration_date: new Date(), percent: 0, applyDiscount(price: number): number { return 0; }, can_be_applied(value: any): boolean { return false;  } }, {} )
        expect(typeof res == "string").to.be.true
        expect(typeof (system.appointOwner(userID, shopID,"OvedMetzuyan@post.co.il")) == "boolean").to.be.true
        res = system.addProduct(nEmpID, shopID,"TV", "Best desc", 1000, ["monitors"],1000, { expiration_date: new Date(), percent: 0, applyDiscount(price: number): number { return 0; }, can_be_applied(value: any): boolean { return false;  } }, {} )
        expect(typeof res == "string").to.be.false // good
        let sad_appoint = system.appointOwner(userID, shopID,"OvedMetzuyan@post.co.il")
        expect(typeof sad_appoint == "string").to.be.true //sad //TODO i can appoint a owner whos already an owner?
        //TODO do the bad one, i got confused. a guest tries to promote a reg user to be an owner

    });

    it('4.5: Appoint - appoint a new manager to the shop', () => {
        const system: System = SystemDriver.getSystem(true);
        //Original owner
        let reg = system.performRegister("Test@test.com", "TESTER");
        let userID = system.performLogin("Test@test.com", "TESTER") as number
        let shopID = system.addShop(userID as number, "TestShop", "shop for tests", "Beer Sheva", "En li kesef") as number
        //create new employee
        let newEmp = system.performRegister("OvedMetzuyan@post.co.il", "123")
        let nEmpID = system.performLogin("OvedMetzuyan@post.co.il", "123") as number
        let shopInfo = (system.getShopInfo(shopID) as string[])[0]
        expect( shopInfo.indexOf("Managers:") < shopInfo.indexOf("OvedMetzuyan@post.co.il") ).to.be.false
        expect(typeof (system.appointManager(userID, shopID,"OvedMetzuyan@post.co.il")) == "boolean").to.be.true
        shopInfo = (system.getShopInfo(shopID) as string[])[0]
        expect( shopInfo.indexOf("Managers:") < shopInfo.indexOf("OvedMetzuyan@post.co.il") ).to.be.true
        //TODO sad - reappoint same manager.
        //TODO bad - guest appoints a manager.
    });
//TODO mark - reset static counter for complete system reset
    it('4.6: Manager permissions - modify a manager permission', () => {
        const system: System = SystemDriver.getSystem(true);
        system.performRegister("Test@test.com", "TESTER");
        let originOwner = system.performLogin("Test@test.com", "TESTER") as number
        let shopID = system.addShop(originOwner as number, "TestShop", "shop for tests", "Beer Sheva", "En li kesef") as number
        //create new employee
        let newEmp = system.performRegister("OvedMetzuyan@post.co.il", "123")
        let nEmpID = system.performLogin("OvedMetzuyan@post.co.il", "123") as number
        expect(typeof (system.appointManager(originOwner, shopID,"OvedMetzuyan@post.co.il")) == "boolean").to.be.true
        let res = system.addProduct(nEmpID, shopID,"TV", "Best desc", 1000, ["monitors"],1000, { expiration_date: new Date(), percent: 0, applyDiscount(price: number): number { return 0; }, can_be_applied(value: any): boolean { return false;  } }, {} )
        expect(typeof res == "string").to.be.true
        expect(typeof system.addPermissions(originOwner,shopID,"OvedMetzuyan@post.co.il",Action.AddItem) == "boolean").to.be.true
        res = system.addProduct(nEmpID, shopID,"TV", "Best desc", 1000, ["monitors"],1000, { expiration_date: new Date(), percent: 0, applyDiscount(price: number): number { return 0; }, can_be_applied(value: any): boolean { return false;  } }, {} )
        expect(typeof res == "string").to.be.false
        //TODO SAD BAD
    });

    it('4.7: Manager - remove a manager from the shop', () => {
        //expect(ShopManagment.removeManager(appointier_ID, apointee_ID)).to.be.true;
        //expect(ShopManagment.isManager(apointee_ID)).to.be.true;
        //expect(ShopManagment.removeManager(appointier_ID, notManagerApointee_ID)).to.be.false;
        //user is not an owner of the shop
        // expect(ShopManagment.removeManager(appointier_ID, apointee_ID)).to.be.false;
    });

    it('4.9: Information - gets every manager and owner in the shop, include their permissions', () => {

    });

    it('4.11: Purchase History - gets a shop purchase history', () => {
        
    });
});

describe('Admin:', () => {
    it('6.4.1: Information - gets a purchase history of a given user', () => {
        const system: System = SystemDriver.getSystem(true);
        system.performRegister("Test@test.com", "TESTER");
        let originOwner = system.performLogin("Test@test.com", "TESTER") as number
        let shopID = system.addShop(originOwner as number, "TestShop", "shop for tests", "Beer Sheva", "En li kesef") as number
        system.addProduct(originOwner, shopID,"TV", "Best desc", 1000, ["monitors"],1000, { expiration_date: new Date(), percent: 0, applyDiscount(price: number): number { return 0; }, can_be_applied(value: any): boolean { return false;  } }, {} )
        system.performRegister("newUser@test.com", "TESTER");
        let user = system.performLogin("newUser@test.com", "TESTER") as number
        let add_to_basket = system.addItemToBasket(user, 0, shopID, 500)
        expect(typeof add_to_basket == "string").to.be.false
        let purchase = system.purchaseShoppingBasket(user, shopID, "hello")
        expect(typeof purchase == "boolean").to.be.true
        let admin = system.performLogin("admin@gmail.com", "admin") as number
        let result = system.adminDisplayUserHistory(admin, user) as string[]
        expect(result.length).to.be.eq(1)
        let sad_result = system.adminDisplayUserHistory(150,user)
        expect(typeof sad_result == "string").to.be.true
        let bad_result = system.adminDisplayUserHistory(admin,150)
        expect(typeof bad_result == "string").to.be.true
    });
    it('6.4.2: Information - gets a purchase history of a given shop', () => {
        const system: System = SystemDriver.getSystem(true);
        system.performRegister("Test@test.com", "TESTER");
        let originOwner = system.performLogin("Test@test.com", "TESTER") as number
        let shopID = system.addShop(originOwner as number, "TestShop", "shop for tests", "Beer Sheva", "En li kesef") as number
        system.addProduct(originOwner, shopID,"TV", "Best desc", 1000, ["monitors"],1000, { expiration_date: new Date(), percent: 0, applyDiscount(price: number): number { return 0; }, can_be_applied(value: any): boolean { return false;  } }, {} )
        system.performRegister("newUser@test.com", "TESTER");
        let user = system.performLogin("newUser@test.com", "TESTER") as number
        let add_to_basket = system.addItemToBasket(user, 0, shopID, 500)
        expect(typeof add_to_basket == "string").to.be.false
        let purchase = system.purchaseShoppingBasket(user, shopID, "hello")
        expect(typeof purchase == "boolean").to.be.true
        let admin = system.performLogin("admin@gmail.com", "admin") as number
        let result = system.adminDisplayShopHistory(admin, shopID) as string[]
        expect(result.length).to.be.eq(1) //good TODO purchase was made so why size is 0?
        let sad_result = system.adminDisplayShopHistory(admin,150)
        expect(typeof sad_result == "string").to.be.true // sad
        let bad_result = system.adminDisplayShopHistory(12,shopID)
        expect(typeof bad_result == "string").to.be.true //bad
    });
});

describe('Services:', () => {
    it('Payment Handler', () => {
        //TODO milestone 2
    });

    it('Spell Checker', () => {
        //TODO milestone 2
    });
});