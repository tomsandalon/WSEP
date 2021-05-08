import {assert, expect} from "chai";
import {SystemDriver} from "./SystemDriver";
import {System} from "./System";
import {Action} from "../../Logic/Domain/ShopPersonnel/Permissions";
import {SearchTypes} from "../../Logic/Domain/System";
import {Filter_Type} from "../../Logic/Domain/Shop/ShopInventory";
import {BasketDoesntExists} from "../../Logic/Domain/ProductHandling/ErrorMessages";


describe('Acceptance Tests:', () => {
    describe('Guest:2.1: Enter - enter to the system as a guest', () => {
        it('Happy', () => {
            const system: System = SystemDriver.getSystem(true);
            system.openSession();
        });
    });

    describe('Guest:2.2: Exit - exit', () => {
        it('Happy', () => {
            const system: System = SystemDriver.getSystem(true);
            let user_id = system.openSession();
            system.closeSession(user_id);
        });
    });

    describe('Guest:2.3: Registration - Add a new user to the system', () => {
        const system: System = SystemDriver.getSystem(true);
        it('Happy', () => {
            let reg = system.performRegister("Test@test.com", "TESTER");
            expect(reg).to.be.true;
        });
        it('Sad: register an existing user', () => {
            let sad_reg = system.performRegister("Test@test.com","blabla");
            expect(sad_reg).to.be.false;
        });
        it('Bad: register with invalid email or password', () => {
            let bad_reg = system.performRegister("","");
            expect(bad_reg).to.be.false
        });
    });

    describe('Guest:2.4: Login - User success to login', () => {
        const system: System = SystemDriver.getSystem(true);
        it('Happy', () => {
            let reg = system.performRegister("Test@test.com", "TESTER");
            expect(reg).to.be.true;
            let user = system.performLogin("Test@test.com", "TESTER");
            expect(typeof user == "number").to.be.true;
        });
        it('Sad: Login with a user that already logged in', () => {
            let sad_user = system.performLogin("Test@test.com","test")
            expect(typeof sad_user == "string").to.be.true;
        });
        it('Bad: Login with unregistered user', () => {
            let bad_user = system.performLogin("321321321321321312312312312312312312", "1232132131232132123213213")
            expect(typeof bad_user == "string").to.be.true
        });
    });

    describe('Guest:2.5: Information - get info about shop and its products', () => {
        const system: System = SystemDriver.getSystem(true);
        system.performRegister("Test@test.com", "TESTER");
        let originOwner = system.performLogin("Test@test.com", "TESTER") as number
        // expect(system.getShopInfo(0)).to.be.eq("Shop 0 doesn't exist")
        let shopID = system.addShop(originOwner as number, "TestShop", "shop for tests", "Beer Sheva", "En li kesef") as number
        // expect(system.getShopInfo(0).length == 1).to.be.true
        // expect(system.getShopInfo(0)[0].includes("TestShop")).to.be.true
        system.addProduct(originOwner, shopID,"TV", "Best desc", 1000, ["monitors"],1000, { expiration_date: new Date(), percent: 0, applyDiscount(price: number): number { return 0; }, can_be_applied(value: any): boolean { return false;  } })

        it('Happy', () => {
            expect(system.getShopInfo(0)[0].includes("TV")).to.be.true
        });
        it('Sad: get info of not existing shop', () => {
            let sad = system.getShopInfo(1000)
            expect(typeof sad =="string").to.be.true    });
        it('Bad', () => {
            //TODO
        });

    });
    describe('Guest:2.6: Search - search an item by detail and get all the shops that sells it', () => {
        const system: System = SystemDriver.getSystem(true);
        system.performRegister("Test@test.com", "TESTER");
        let originOwner = system.performLogin("Test@test.com", "TESTER") as number
        let shopID1 = system.addShop(originOwner as number, "TestShop 1", "shop for Tests", "Beer Sheva", "En li kesef") as number
        let shopID2 = system.addShop(originOwner as number, "TestShop 2", "shop for Tests", "Beer Sheva", "En li kesef") as number
        let shopID3 = system.addShop(originOwner as number, "TestShop 3", "shop for Tests", "Beer Sheva", "En li kesef") as number

        system.addProduct(originOwner, shopID1,"TV1", "Best desc", 1110, ["not monitors"],111, { expiration_date: new Date(), percent: 0, applyDiscount(price: number): number { return 0; }, can_be_applied(value: any): boolean { return false;  } })
        system.addProduct(originOwner, shopID2,"TV2", "Best desc", 2202, ["monitors"],222, { expiration_date: new Date(), percent: 0, applyDiscount(price: number): number { return 0; }, can_be_applied(value: any): boolean { return false;  } })
        system.addProduct(originOwner, shopID3,"TV3", "Best desc", 3303, ["monitors"],333, { expiration_date: new Date(), percent: 0, applyDiscount(price: number): number { return 0; }, can_be_applied(value: any): boolean { return false;  } })

        // expect(system.searchItemFromShops(SearchTypes.name, "TV1").length == 1 &&
        //     system.searchItemFromShops(SearchTypes.name, "TV1")[0].includes("TV1")).to.be.true
        // expect(system.searchItemFromShops(SearchTypes.category, "monitors").length == 2 &&
        //     system.searchItemFromShops(SearchTypes.category, "monitors")[0].includes("TV2") &&
        //     system.searchItemFromShops(SearchTypes.category, "monitors")[1].includes("TV3")).to.be.true

        it('Happy', () => {
            let result = system.filterSearch(SearchTypes.category, "monitors", [{filter_type: Filter_Type.AbovePrice, filter_value: "200"}, {filter_type: Filter_Type.BelowPrice, filter_value: "300"}])
            expect(result.length == 1 && result[0].includes("TV2")).to.be.true //good
        });
        it('Sad: search item by non-existing category', () => {
            let sad = system.searchItemFromShops(SearchTypes.category, "a category which doesnt exist")
            expect(sad.length).to.be.eq(0)
        });
        it('Bad', () => {
            //TODO
        });
    });
    describe('Guest:2.7: Basket - add a product to the basket', () => {
        const system: System = SystemDriver.getSystem(true);
        system.performRegister("Test@test.com", "TESTER");
        let originOwner = system.performLogin("Test@test.com", "TESTER") as number
        let shopID = system.addShop(originOwner as number, "TestShop", "shop for Tests", "Beer Sheva", "En li kesef") as number
        system.addProduct(originOwner, shopID,"TV", "Best desc", 1000, ["monitors"],1000, { expiration_date: new Date(), percent: 0, applyDiscount(price: number): number { return 0; }, can_be_applied(value: any): boolean { return false;  } })
        system.performRegister("newUser@test.com", "TESTER");
        let user = system.performLogin("newUser@test.com", "TESTER") as number

        it('Happy', () => {
            let add_to_basket = system.addItemToBasket(user, 0, shopID, 500)
            expect(typeof add_to_basket == "string").to.be.false
        });
        it('Sad: add a product with amount that is unavailable', () => {
            let sad_add = system.addItemToBasket(user, 0, shopID, 1500);
            expect(typeof sad_add == "string").to.be.true
        });
        it('Bad: add a product with negative amount', () => {
            let bad_add = system.addItemToBasket(user, 0, shopID, -150);
            expect(typeof  bad_add == "string").to.be.true
        });
    });
    describe('Guest:2.8: Information - get info and edit the shopping basket', () => {
        const system: System = SystemDriver.getSystem(true);
        system.performRegister("Test@test.com", "TESTER");
        let originOwner = system.performLogin("Test@test.com", "TESTER") as number
        let shopID = system.addShop(originOwner as number, "TestShop", "shop for Tests", "Beer Sheva", "En li kesef") as number
        system.addProduct(originOwner, shopID,"TV", "Best desc", 10000, ["monitors"],1000, { expiration_date: new Date(), percent: 0, applyDiscount(price: number): number { return 0; }, can_be_applied(value: any): boolean { return false;  } })
        system.performRegister("newUser@test.com", "TESTER");
        let user = system.performLogin("newUser@test.com", "TESTER") as number
        let add_to_basket = system.addItemToBasket(user, 0, shopID, 500)
        // expect(typeof add_to_basket == "string").to.be.false

        it('Happy', () => {
            system.editShoppingCart(user, shopID, 0, 9999)
            let cart_info = system.displayShoppingCart(user) as string[][]
            expect(cart_info[0][0].includes("9999")).to.be.true
        });
        it('Sad: edit shopping cart for non-existing shop', () => {
            let sad_edit = system.editShoppingCart(user , 150, 0, 9999);
            expect(typeof sad_edit == "string").to.be.true;
        });
        it('Bad: edit shopping cart with negative product id', () => {
            let bad_edit = system.editShoppingCart(user,150,-125, -21321);
            expect(typeof bad_edit == "string").to.be.true
        });
    });
    describe('Guest:2.9.1: Purchase - buy a specific basket', () => {
        const system: System = SystemDriver.getSystem(true);
        system.performRegister("Test@test.com", "TESTER");
        let originOwner = system.performLogin("Test@test.com", "TESTER") as number
        let shopID = system.addShop(originOwner as number, "TestShop", "shop for Tests", "Beer Sheva", "En li kesef") as number
        system.addProduct(originOwner, shopID,"TV", "Best desc", 1000, ["monitors"],1000, { expiration_date: new Date(), percent: 0, applyDiscount(price: number): number { return 0; }, can_be_applied(value: any): boolean { return false;  } })
        system.addProduct(originOwner, shopID,"8KTV", "Best desc", 0, ["monitors"],1000, { expiration_date: new Date(), percent: 0, applyDiscount(price: number): number { return 0; }, can_be_applied(value: any): boolean { return false;  } })
        system.performRegister("newUser@test.com", "TESTER");
        let user = system.performLogin("newUser@test.com", "TESTER") as number
        let add_to_basket = system.addItemToBasket(user, 0, shopID, 500)
        // expect(typeof add_to_basket == "string").to.be.false

        it('Happy', () => {
            let purchase = system.purchaseShoppingBasket(user, shopID, "hello")
            expect(typeof purchase == "boolean").to.be.true // good
        });
        it('Sad: buy basket from non-existing shop', () => {
            let sad_purchase = system.purchaseShoppingBasket(user, 152, "hello");
            expect(sad_purchase).to.be.eq(BasketDoesntExists)
        });
        it('Sad: try to buy when inventory is empty', () => {
            // add the 8kTV product with empty inventory to basket
            let fail = system.addItemToBasket(user, 1, shopID, 1)
            //FIXME: why i dont get a fail?
            expect(typeof fail == "string").to.be.true;
        });
        it('Bad: buy a basket with negative user id', () => {
            let bad_purchase = system.purchaseShoppingBasket(-150, 152, "hello");
            expect(typeof bad_purchase == "string").to.be.true // bad
        });
    });
    describe('Guest:2.9.2: Auction - add a bid to an auction', () => {
        it('Happy', () => {
            //TODO Milestone 2

            // expect(shop.addBid(productID, amount, paymentInfo)).to.be.true;
            // expect(shop.addBid(productID, lowerAmount, paymentInfo)).to.be.false;
        });
        it('Sad', () => {
            //TODO
        });
        it('Bad', () => {
            //TODO
        });
    });
    describe('Guest:2.9.3: Auction - credit card charged, product added to purchase history', () => {
        it('Happy', () => {
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
        it('Sad', () => {
            //TODO
        });
        it('Bad', () => {
            //TODO
        });
    });
    describe('Guest:2.9.4: Offer -  credit card charged, product added to purchase history', () => {
        it('Happy', () => {
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
        it('Sad', () => {
            //TODO
        });
        it('Bad', () => {
            //TODO
        });
    });
    describe('Guest:2.9.5: Lottery -  choose random winner, credit card charged, product added to purchase history', () => {
        it('Happy', () => {
            //TODO Milestone 2

            //assuming user submmision reach the goal price and the user is the winner
            //let balance = service.paymentService.getBalance();
            //shop.buyLotteryTicket(productID, submission);
            //expect(service.paymentBalance.getBalance()).equal(balance - submission);
            //expect(user.getPurchaseHistory().contains(productID)).to.be.true;
            //expect(shop.buyLotteryTicket(productID, largeSubmission)).to.be.false; //sad path ??
            //expect(shop.buyLotteryTicket(productID, largeSubmission)).to.be.false; //item removed = bad path ??
        });
        it('Sad', () => {
            //TODO
        });
        it('Bad', () => {
            //TODO
        });
    });
    describe('Guest:2.9.6: Lottery - credit card charged, product added to purchase history', () => {
        it('Happy', () => {
            //TODO Milestone 2
            //the difference from 2.9.5?
        });
        it('Sad', () => {
            //TODO
        });
        it('Bad', () => {
            //TODO
        });
    });
    describe('Guest:2.9.7: Discount - price changed by discount policy', () => {
        it('Happy', () => {
            //TODO Milestone 2
            //expect(shop.getDiscountedPrice(productID)).not.equal(shop.getPrice(productID));
        });
        it('Sad', () => {
            //TODO
        });
        it('Bad', () => {
            //TODO
        });
    });
    describe('Registered:3.1: Logout - user success to logout', () => {
        it('Happy', () => {
            const system: System = SystemDriver.getSystem(true);
            let reg = system.performRegister("Test@test.com", "TESTER");
            let user = system.performLogin("Test@test.com", "TESTER");
            expect(typeof user == "string").to.be.false
            system.logout("Test@test.com")//good
            assert(true)
            //TODO expand test when connection handler is implemented
        });
        it('Sad', () => {
            //TODO
        });
        it('Bad', () => {
            //TODO
        });
    });
    describe('Registered:3.2: Open shop - add a new shop to the system, add the user as original owner', () => {
        const system: System = SystemDriver.getSystem(true);
        let reg = system.performRegister("Test@test.com", "TESTER");
        let user = system.performLogin("Test@test.com", "TESTER");

        it('Happy', () => {
            let shopID = system.addShop(user as number, "TestShop", "shop for tests", "Beer Sheva", "En li kesef");
            expect(typeof shopID == "number").to.be.true
            expect( typeof (system.getShopInfo(shopID as number)) == "string").to.be.false
            expect(system.getShopInfo(shopID as number)[0].includes("Test@test.com")).to.be.true
        });
        it('Sad: add a new shop with empty name', () => {
            let sad_shopID = system.addShop(user as number, "", "shop for tests", "Beer Sheva", "En li kesef");
            expect(typeof sad_shopID == "string").to.be.true
        });
        it('Bad: add a new shop without any details', () => {
            let bad_shopID = system.addShop(user as number, "", "", "", "");
            expect(typeof bad_shopID == "string").to.be.true
        });
    });

    describe('Registered:3.7: Information - get the purchase history', () => {
        const system: System = SystemDriver.getSystem(true);
        system.performRegister("Test@test.com", "TESTER");
        let originOwner = system.performLogin("Test@test.com", "TESTER") as number
        let shopID = system.addShop(originOwner as number, "TestShop", "shop for Tests", "Beer Sheva", "En li kesef") as number
        system.addProduct(originOwner, shopID,"TV", "Best desc", 1000, ["monitors"],1000, { expiration_date: new Date(), percent: 0, applyDiscount(price: number): number { return 0; }, can_be_applied(value: any): boolean { return false;  } })
        system.performRegister("newUser@test.com", "TESTER");
        let user = system.performLogin("newUser@test.com", "TESTER") as number
        system.addItemToBasket(user, 0, shopID, 500)
        let result = system.userOrderHistory(user) as string[]
        // expect(result[0]).to.be.eq("Empty order history") // TODO : is it count as sad test?

        it('Happy', () => {
            system.purchaseShoppingBasket(user, shopID, "hello")
            result = system.userOrderHistory(user) as string[]
            expect(result[0]).to.be.not.eq("Empty order history")
            expect(result[0].includes("TV")).to.be.true
        });
        it('Sad: ', () => {
            //TODO
        });
        it('Bad', () => {
            //TODO
        });
    });
    describe('Owner:4.1.1: Product - add a new product to the shop', () => {
        const system: System = SystemDriver.getSystem(true);
        let reg = system.performRegister("Test@test.com", "TESTER");
        let userID = system.performLogin("Test@test.com", "TESTER") as number
        let shopID = system.addShop(userID as number, "TestShop", "shop for Tests", "Beer Sheva", "En li kesef") as number
        let items = system.getItemsFromShop(shopID) as string[]
        // expect(items.some(p=>p.includes("TV"))).to.be.false

        it('Happy', () => {
            const res = system.addProduct(userID, shopID,"TV", "Best desc", 1000, ["monitors"],1000, { expiration_date: new Date(), percent: 0, applyDiscount(price: number): number { return 0; }, can_be_applied(value: any): boolean { return false;  } })
            expect(typeof res == "boolean").to.be.true
            items = system.getItemsFromShop(shopID) as string[]
            expect(items.some(p=>p.includes("TV"))).to.be.true
        });
        it('Sad: add a product with empty name ', () => {
            const sad_res = system.addProduct(userID, shopID,"", "Best desc", 1000, ["monitors"],1000, { expiration_date: new Date(), percent: 0, applyDiscount(price: number): number { return 0; }, can_be_applied(value: any): boolean { return false;  } })
            expect(typeof sad_res == "string").to.be.true
        });
        it('Bad: add a product with a guest user', () => {
            let guest = system.performGuestLogin();
            const bad_res = system.addProduct(guest, shopID,"TV", "Best desc", 1000, ["monitors"],1000, { expiration_date: new Date(), percent: 0, applyDiscount(price: number): number { return 0; }, can_be_applied(value: any): boolean { return false;  } })
            expect(typeof bad_res == "string").to.be.true
        });
    });

    describe('Owner:4.1.2: Product - remove a product from the shop', () => {
        const system: System = SystemDriver.getSystem(true);
        let reg = system.performRegister("Test@test.com", "TESTER");
        let userID = system.performLogin("Test@test.com", "TESTER") as number
        let shopID = system.addShop(userID as number, "TestShop", "shop for Tests", "Beer Sheva", "En li kesef") as number
        let res = system.addProduct(userID, shopID,"TV", "Best desc", 1000, ["monitors"],1000, { expiration_date: new Date(), percent: 0, applyDiscount(price: number): number { return 0; }, can_be_applied(value: any): boolean { return false;  } })

        // let items = system.getItemsFromShop(shopID) as string[]
        // expect(items.some(p=>p.includes("TV"))).to.be.true
        it('Happy', () => {
            system.removeProduct(userID, shopID, 0) //we know that it's 0 as we reset the tests every time
            expect((system.getItemsFromShop(shopID) as string[]).some(p=>p.includes("TV"))).to.be.false
        });
        // it('Sad: Try to remove product while not having proper permissions', () => {
        //     system.addProduct(userID, shopID,"TV", "Best desc", 1000, ["monitors"],1000, { expiration_date: new Date(), percent: 0, applyDiscount(price: number): number { return 0; }, can_be_applied(value: any): boolean { return false;  } })
        //     system.performRegister("OvedMetzuyan@post.co.il", "123")
        //     let nEmpID = system.performLogin("OvedMetzuyan@post.co.il", "123") as number
        //     system.appointManager(userID, shopID,"OvedMetzuyan@post.co.il")
        //     system.removeProduct(nEmpID, shopID, 1) //we know it's 1
        //     expect((system.getItemsFromShop(shopID) as string[]).some(p=>p.includes("TV"))).to.be.true
        // });
        it('Bad: remove a product with invalid product id', () => {
            system.addProduct(userID, shopID,"TV", "Best desc", 1000, ["monitors"],1000, { expiration_date: new Date(), percent: 0, applyDiscount(price: number): number { return 0; }, can_be_applied(value: any): boolean { return false;  } })
            system.removeProduct(userID, shopID, -1)
            expect((system.getItemsFromShop(shopID) as string[]).some(p=>p.includes("TV"))).to.be.true
        });
    });

    describe('Owner:4.2.1: Purchase policy - add a new purchase policy to the shop', () => {
        it('Happy', () => {
            //TODO
            //user is an owner
            //expect(Shop.addPolicy(policy)).to.be.true;
            //expect(Shop.addPolicy(wrongPolicy)).to.be.false;
            //not an owner
            //expect(Shop.addPolicy(policy)).to.be.false;
        });
        it('Sad', () => {
            //TODO
        });
        it('Bad', () => {
            //TODO
        });
    });

    describe('Owner:4.2.2: Discount policy - add a new discount policy to the shop', () => {
        it('Happy', () => {
            //TODO
            //user is an owner
            //expect(Shop.addPolicy(policy)).to.be.true;
            //expect(Shop.addPolicy(wrongPolicy)).to.be.false;
            //not an owner
            //expect(Shop.addPolicy(policy)).to.be.false;
        });
        it('Sad', () => {
            //TODO
        });
        it('Bad', () => {
            //TODO
        });
    });

    describe('Owner:4.2.3: Purchase type - add a new purchase type to the shop', () => {
        it('Happy', () => {
            //TODO
            //user is an owner
            //expect(Shop.addPurchaseType(purchaseType)).to.be.true;
            //expect(Shop.addPurchaseType(purchaseType)).to.be.false;//already exists
            //not an owner
            //expect(Shop.addPurchseType(purchaseType)).to.be.false;
        });
        it('Sad', () => {
            //TODO
        });
        it('Bad', () => {
            //TODO
        });
    });

    describe('Owner:4.2.4: Discount type - add a new discount type to the shop', () => {
        it('Happy', () => {
            //user is an owner
            //expect(Shop.addDiscountType(DiscountType)).to.be.true;
            //expect(Shop.addDiscountType(DiscountType)).to.be.false;//already exists
            //not an owner
            //expect(Shop.addDiscountType(discountType)).to.be.false;
        });
        it('Sad', () => {
            //TODO
        });
        it('Bad', () => {
            //TODO
        });
    });

    describe('Owner:4.3: Appoint - appoint a new owner to the shop', () => {
        const system: System = SystemDriver.getSystem(true);
        //Original owner
        let reg = system.performRegister("Test@test.com", "TESTER");
        let userID = system.performLogin("Test@test.com", "TESTER") as number
        let shopID = system.addShop(userID as number, "TestShop", "shop for tests", "Beer Sheva", "En li kesef") as number

        it('Happy', () => {
            //create new employee and appoint him as an owner
            let newEmp = system.performRegister("OvedMetzuyan@post.co.il", "123")
            let nEmpID = system.performLogin("OvedMetzuyan@post.co.il", "123") as number
            let res = system.addProduct(nEmpID, shopID,"TV", "Best desc", 1000, ["monitors"],1000, { expiration_date: new Date(), percent: 0, applyDiscount(price: number): number { return 0; }, can_be_applied(value: any): boolean { return false;  } })
            expect(typeof res == "string").to.be.true
            expect(typeof (system.appointOwner(userID, shopID,"OvedMetzuyan@post.co.il")) == "boolean").to.be.true
            res = system.addProduct(nEmpID, shopID,"TV", "Best desc", 1000, ["monitors"],1000, { expiration_date: new Date(), percent: 0, applyDiscount(price: number): number { return 0; }, can_be_applied(value: any): boolean { return false;  } })
            expect(typeof res == "string").to.be.false
        });
        it('Sad: appoint an already owner user as an owner', () => {
            let sad_appoint = system.appointOwner(userID, shopID,"OvedMetzuyan@post.co.il")
            expect(typeof sad_appoint == "string").to.be.true
        });
        it('Bad: appoint user with a user that is not the owner of the shop', () => {
            let anotherNewEmp = system.performRegister("OvedRa@post.co.il", "123")
            let anoutherEmpID = system.performLogin("OvedRa@post.co.il", "123") as number
            let anotherAnotherNewEmp = system.performRegister("OvedRaMeod@post.co.il", "123")
            let anotherAnoutherEmpID = system.performLogin("OvedRaMeod@post.co.il", "123") as number
            let bad_appoint = system.appointOwner(anoutherEmpID, shopID,"OvedRaMeod@post.co.il")
            expect(typeof bad_appoint == "string").to.be.true
        });
    });

    describe('Owner:4.5: Appoint - appoint a new manager to the shop', () => {
        const system: System = SystemDriver.getSystem(true);
        //Original owner
        let reg = system.performRegister("Test@test.com", "TESTER");
        let userID = system.performLogin("Test@test.com", "TESTER") as number
        let shopID = system.addShop(userID as number, "TestShop", "shop for tests", "Beer Sheva", "En li kesef") as number

        it('Happy', () => {
            //create new employee
            let newEmp = system.performRegister("OvedMetzuyan@post.co.il", "123")
            let nEmpID = system.performLogin("OvedMetzuyan@post.co.il", "123") as number
            let shopInfo = (system.getShopInfo(shopID) as string[])[0]
            expect( shopInfo.indexOf("Managers:") < shopInfo.indexOf("OvedMetzuyan@post.co.il") ).to.be.false
            expect(typeof (system.appointManager(userID, shopID,"OvedMetzuyan@post.co.il")) == "boolean").to.be.true
            shopInfo = (system.getShopInfo(shopID) as string[])[0]
            expect( shopInfo.indexOf("Managers:") < shopInfo.indexOf("OvedMetzuyan@post.co.il") ).to.be.true
        });
        it('Sad: appoint a user as a manager that is already a manager of the shop ', () => {
            let sad_appoint = system.appointManager(userID, shopID,"OvedMetzuyan@post.co.il")
            expect(typeof sad_appoint == "string").to.be.true //sad
        });
        it('Bad: appoint a user as a manager with a user that is not an owner of the shop', () => {
            system.performRegister("OvedRa@post.co.il", "123")
            let anoutherEmpID = system.performLogin("OvedRa@post.co.il", "123") as number
            system.performRegister("OvedRaMeod@post.co.il", "123")
            system.performLogin("OvedRaMeod@post.co.il", "123") as number
            let bad_appoint = system.appointManager(anoutherEmpID, shopID,"OvedRaMeod@post.co.il")
            expect(typeof bad_appoint == "string").to.be.true //bad
        });
    });
    describe('Owner:4.6: Manager permissions - modify a manager permission', () => {
        const system: System = SystemDriver.getSystem(true);
        system.performRegister("Test@test.com", "TESTER");
        let originalOwner = system.performLogin("Test@test.com", "TESTER") as number
        let shopID = system.addShop(originalOwner as number, "TestShop", "shop for tests", "Beer Sheva", "En li kesef") as number

        it('Happy', () => {
            //create new employee
            let newEmp = system.performRegister("OvedMetzuyan@post.co.il", "123")
            let nEmpID = system.performLogin("OvedMetzuyan@post.co.il", "123") as number
            expect(typeof (system.appointManager(originalOwner, shopID,"OvedMetzuyan@post.co.il")) == "boolean").to.be.true
            let res = system.addProduct(nEmpID, shopID,"TV", "Best desc", 1000, ["monitors"],1000, { expiration_date: new Date(), percent: 0, applyDiscount(price: number): number { return 0; }, can_be_applied(value: any): boolean { return false;  } })
            expect(typeof res == "string").to.be.true
            expect(typeof system.addPermissions(originalOwner,shopID,"OvedMetzuyan@post.co.il",Action.AddItem) == "boolean").to.be.true
            res = system.addProduct(nEmpID, shopID,"TV", "Best desc", 1000, ["monitors"],1000, { expiration_date: new Date(), percent: 0, applyDiscount(price: number): number { return 0; }, can_be_applied(value: any): boolean { return false;  } })
            expect(typeof res == "string").to.be.false
        });
        it('Sad: add the same permissions', () => {
            //In case of failure, is it related to the happy test flow?
            let prev = system.getShopInfo(shopID)[0] as string
            system.addPermissions(originalOwner,shopID,"OvedMetzuyan@post.co.il",Action.AddItem)
            let cur = system.getShopInfo(shopID)[0] as string
            expect(prev).eq(cur)
        });
        it('Bad: modify a manager permissions with a user that is not an owner of the shop', () => {
            let otherOwner = system.performRegister("OvedaMetzuyan@post.co.il", "123")
            let differentId = system.performLogin("OvedaMetzuyan@post.co.il", "123") as number
            system.appointOwner(originalOwner, shopID,"OvedaMetzuyan@post.co.il")
            let bad = system.addPermissions(differentId, shopID, "OvedMetzuyan@post.co.il",Action.RemoveItem)
            expect(typeof bad == "string").to.be.true
        });
    });

    describe('Owner:4.7: Manager - remove a manager from the shop', () => {
        const system: System = SystemDriver.getSystem(true);
        //Original owner
        let reg = system.performRegister("Test@test.com", "TESTER");
        let userID = system.performLogin("Test@test.com", "TESTER") as number
        let shopID = system.addShop(userID as number, "TestShop", "shop for tests", "Beer Sheva", "En li kesef") as number

        it('Happy', () => {
            //create new employee
            let newEmp = system.performRegister("OvedMetzuyan@post.co.il", "123")
            let nEmpID = system.performLogin("OvedMetzuyan@post.co.il", "123") as number
            expect(typeof (system.appointManager(userID, shopID,"OvedMetzuyan@post.co.il")) == "boolean").to.be.true
            system.removeManager(userID, shopID, "OvedMetzuyan@post.co.il")
            let shopInfo = (system.getShopInfo(shopID) as string[])[0]
            expect(shopInfo.indexOf("Managers:") < shopInfo.indexOf("OvedMetzuyan@post.co.il") ).to.be.false
        });
        it('Sad: remove non-manager user from managment of the shop', () => {
            expect(typeof (system.removeManager(userID, shopID,"noone@post.co.il")) == "string").to.be.true
        });
        it('Bad: remove a manager with a user that is not an owner of the shop', () => {
            let other = system.performRegister("aaaa@post.co.il", "123")
            let otherId = system.performLogin("aaa@post.co.il", "123") as number
            expect(typeof (system.removeManager(otherId, shopID, "OvedMetzuyan@post.co.il")) == "string").to.be.true
        });
    });

    describe('Owner:4.9: Information - gets every manager and owner in the shop, include their permissions', () => {
        it('Happy', () => {
            //TODO
        });
        it('Sad', () => {
            //TODO
        });
        it('Bad', () => {
            //TODO
        });
    });

    describe('Owner:4.11: Purchase History - gets a shop purchase history', () => {
        it('Happy', () => {
            //TODO
        });
        it('Sad', () => {
            //TODO
        });
        it('Bad', () => {
            //TODO
        });
    });
    describe('Admin:6.4.1: Information - gets a purchase history of a given user', () => {
        const system: System = SystemDriver.getSystem(true);
        system.performRegister("Test@test.com", "TESTER");
        let originOwner = system.performLogin("Test@test.com", "TESTER") as number
        let shopID = system.addShop(originOwner as number, "TestShop", "shop for Tests", "Beer Sheva", "En li kesef") as number
        system.addProduct(originOwner, shopID,"TV", "Best desc", 1000, ["monitors"],1000, { expiration_date: new Date(), percent: 0, applyDiscount(price: number): number { return 0; }, can_be_applied(value: any): boolean { return false;  } })
        system.performRegister("newUser@test.com", "TESTER");
        let user = system.performLogin("newUser@test.com", "TESTER") as number
        let add_to_basket = system.addItemToBasket(user, 0, shopID, 500)
        // expect(typeof add_to_basket == "string").to.be.false
        let purchase = system.purchaseShoppingBasket(user, shopID, "hello")
        // expect(typeof purchase == "boolean").to.be.true
        let admin = system.performLogin("admin@gmail.com", "admin") as number

        it('Happy', () => {
            let result = system.adminDisplayUserHistory(admin, user) as string[]
            expect(result.length).to.be.eq(1)
        });
        it('Sad:get a purchase history from not existing user', () => {
            let sad_result = system.adminDisplayUserHistory(admin,150)
            expect(typeof sad_result == "string").to.be.true
        });
        it('Bad: get a purchase history with non-admin user', () => {
            let bad_result = system.adminDisplayUserHistory(150,user)
            expect(typeof bad_result == "string").to.be.true
        });
    });
    describe('Admin:6.4.2: Information - gets a purchase history of a given shop', () => {
        const system: System = SystemDriver.getSystem(true);
        system.performRegister("Test@test.com", "TESTER");
        let originOwner = system.performLogin("Test@test.com", "TESTER") as number
        let shopID = system.addShop(originOwner as number, "TestShop", "shop for Tests", "Beer Sheva", "En li kesef") as number
        system.addProduct(originOwner, shopID,"TV", "Best desc", 1000, ["monitors"],1000, { expiration_date: new Date(), percent: 0, applyDiscount(price: number): number { return 0; }, can_be_applied(value: any): boolean { return false;  } })
        system.performRegister("newUser@test.com", "TESTER");
        let user = system.performLogin("newUser@test.com", "TESTER") as number
        let add_to_basket = system.addItemToBasket(user, 0, shopID, 500)
        expect(typeof add_to_basket == "string").to.be.false
        let purchase = system.purchaseShoppingBasket(user, shopID, "hello")
        expect(typeof purchase == "boolean").to.be.true
        let admin = system.performLogin("admin@gmail.com", "admin") as number

        it('Happy', () => {
            let result = system.adminDisplayShopHistory(admin, shopID) as string[]
            expect(result.length).to.be.eq(1)
        });
        it('Sad: get a purchase history from non-existing shop', () => {
            let sad_result = system.adminDisplayShopHistory(admin,150)
            expect(typeof sad_result == "string").to.be.true
        });
        it('Bad: get a purchase history with non-admin user', () => {
            let bad_result = system.adminDisplayShopHistory(12,shopID)
            expect(typeof bad_result == "string").to.be.true
        });
    });
    describe('Services:Payment Handler', () => {
        const system: System = SystemDriver.getSystem(true);
        system.performRegister("Test@test.com", "TESTER");
        let user = system.performLogin("Test@test.com", "TESTER") as number
        let shopID = system.addShop(user as number, "TestShop", "shop for tests", "Beer Sheva", "En li kesef") as number
        system.addProduct(user, shopID,"TV", "Best desc", 1000, ["monitors"],1000, { expiration_date: new Date(), percent: 0, applyDiscount(price: number): number { return 0; }, can_be_applied(value: any): boolean { return false;  } })
        let add_to_basket = system.addItemToBasket(user, 0, shopID, 200)
        expect(typeof add_to_basket == "string").to.be.false

        it('Happy', () => {
            //TODO milestone 2
            let purchase = system.purchaseShoppingBasket(user, shopID, "MOCK was charged successfully")
            expect(purchase).to.be.true
        });
        it('Sad: user dont have enough money', () => {
            system.addItemToBasket(user, 0, shopID, 200)
            let purchase = system.purchaseShoppingBasket(user, shopID, "MOCK FAIL not enough money")
            expect(purchase).to.be.false
            let notIncluded = system.shopOrderHistory(user,shopID)
            expect(notIncluded.includes('TV')).to.be.false;
        });
        it('Bad: service crash', () => {
            let purchase = system.purchaseShoppingBasket(user, shopID, "MOCK CRASH server is down")
            expect(typeof purchase == 'string').to.be.true;
        });
    });
    describe('Services:Spell Checker', () => {
        const system: System = SystemDriver.getSystem(true);

        it('Happy', () => {
            //TODO milestone 2
            let res = system.spellCheck('FAIEL');
            if (typeof res !== 'string')
                expect(res[0]).eq('FAIL')
            else
                assert.fail();
        });
        it('Sad: input include a word not in english', () => {
            let res = system.spellCheck('FAEEEL');
            if (typeof res !== 'string')
                expect(res[0]).eq('404')
            else
                assert.fail();
        });
        it('Bad: service crash', () => {
            let res = system.spellCheck('CRASH')
            expect(typeof res == 'string').to.be.true
        });
    });
    // describe('Services: delivery');
});