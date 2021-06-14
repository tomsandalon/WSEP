import {assert, expect} from "chai";
import {SystemDriver} from "./SystemDriver";
// import {System} from "./System";
import {Action} from "../../Logic/Domain/ShopPersonnel/Permissions";
import {SearchTypes, System} from "../../Logic/Domain/System";
import {Filter_Type, id_counter, ShopInventory} from "../../Logic/Domain/Shop/ShopInventory";
import {BasketDoesntExists} from "../../Logic/Domain/ProductHandling/ErrorMessages";
import {ConditionType} from "../../Logic/Domain/Shop/PurchasePolicy/SimpleCondition";
import {Operator} from "../../Logic/Domain/Shop/PurchasePolicy/CompositeCondition";
import {DiscountHandler} from "../../Logic/Domain/Shop/DiscountPolicy/DiscountHandler";
import {Condition} from "../../Logic/Domain/Shop/DiscountPolicy/ConditionalDiscount";
import {LogicComposition} from "../../Logic/Domain/Shop/DiscountPolicy/LogicCompositionDiscount";
import {NumericOperation} from "../../Logic/Domain/Shop/DiscountPolicy/NumericCompositionDiscount";
import {ProductImpl} from "../../Logic/Domain/ProductHandling/Product";
import {PublisherImpl} from "../../Logic/Domain/Notifications/PublisherImpl";
import {offer_id_counter} from "../../Logic/Domain/ProductHandling/Offer";

let system
/**
 * @Requirement https://docs.google.com/document/d/1a606MxIS5A5RrXk6Gnc3JQx27IE6jZSh0swnjZ9u9us/edit#heading=h.ic1nksmh7kgv
 */
describe('Guest:2.1: Enter - enter to the system as a guest', () => {
    before(async () => {
        system = await SystemDriver.getSystem(true)
    })
    it('Happy', async () => {
        system.openSession();
    });
});

/**
 * @Requirement https://docs.google.com/document/d/1a606MxIS5A5RrXk6Gnc3JQx27IE6jZSh0swnjZ9u9us/edit#heading=h.ecerbatgpwk4
 */
describe('Guest:2.2: Exit - exit', () => {
    before(async () => {
        system = await SystemDriver.getSystem(true)
    })
    it('Happy', async () => {
        let user_id = system.openSession();
        system.closeSession(user_id);
    });
});

/**
 * @Requirement https://docs.google.com/document/d/1a606MxIS5A5RrXk6Gnc3JQx27IE6jZSh0swnjZ9u9us/edit#heading=h.s0883svk6c2h
 */
describe('Guest:2.3: Registration - Add a new user to the system', async () => {
    before(async () => {
        system = await SystemDriver.getSystem(true)
    })
    it('Happy', () => {
        let reg = system.performRegister("Test@test.com", "TESTER");
        expect(reg).to.be.true;
    });
    it('Sad: register an existing user', () => {
        let sad_reg = system.performRegister("Test@test.com", "blabla");
        expect(sad_reg).to.be.false;
    });
    it('Bad: register with invalid email or password', () => {
        let bad_reg = system.performRegister("", "");
        expect(bad_reg).to.be.false
    });
});

/**
 * @Requirement https://docs.google.com/document/d/1a606MxIS5A5RrXk6Gnc3JQx27IE6jZSh0swnjZ9u9us/edit#heading=h.mrtynned3j8i
 */
describe('Guest:2.4: Login - User success to login', async () => {
    before(async () => {
        system = await SystemDriver.getSystem(true)
    })
    it('Happy', () => {
        let reg = system.performRegister("Test@test.com", "TESTER");
        expect(reg).to.be.true;
        let user = system.performLogin("Test@test.com", "TESTER");
        expect(typeof user == "number").to.be.true;
    });
    it('Sad: Login with a user that already logged in', () => {
        let sad_user = system.performLogin("Test@test.com", "test")
        expect(typeof sad_user == "string").to.be.true;
    });
    it('Bad: Login with unregistered user', () => {
        let bad_user = system.performLogin("321321321321321312312312312312312312", "1232132131232132123213213")
        expect(typeof bad_user == "string").to.be.true
    });
});

/**
 * @Requirement https://docs.google.com/document/d/1a606MxIS5A5RrXk6Gnc3JQx27IE6jZSh0swnjZ9u9us/edit#heading=h.vdd0vxovfnxx
 */
describe('Guest:2.5: Information - get info about shop and its products', async () => {
    before(async () => {
        system = await SystemDriver.getSystem(true)
        system.performRegister("Test@test.com", "TESTER");
        let originOwner = system.performLogin("Test@test.com", "TESTER") as number
        // expect(system.getShopInfo(0)).to.be.eq("Shop 0 doesn't exist")
        let shopID = system.addShop(originOwner as number, "TestShop", "shop for tests", "Beer Sheva", "En li kesef") as number
        // expect(system.getShopInfo(0).length == 1).to.be.true
        // expect(system.getShopInfo(0)[0].includes("TestShop")).to.be.true
        system.addProduct(originOwner, shopID, "TV", "Best desc", 1000, ["monitors"], 1000)
    })

    it('Happy', () => {
        expect(system.getShopInfo(0)[0].includes("TV")).to.be.true
    });
    it('Sad: get info of not existing shop', () => {
        let sad = system.getShopInfo(1000)
        expect(typeof sad == "string").to.be.true
    });
    it('Bad', () => {
        //TODO
    });

});

/**
 * @Requirement https://docs.google.com/document/d/1a606MxIS5A5RrXk6Gnc3JQx27IE6jZSh0swnjZ9u9us/edit#heading=h.k2u60ptuonkv
 */
describe('Guest:2.6: Search - search an item by detail and get all the shops that sells it', async () => {
    before(async () => {
        system = await SystemDriver.getSystem(true)
        system.performRegister("Test@test.com", "TESTER");
        let originOwner = system.performLogin("Test@test.com", "TESTER") as number
        let shopID1 = system.addShop(originOwner as number, "TestShop 1", "shop for Tests", "Beer Sheva", "En li kesef") as number
        let shopID2 = system.addShop(originOwner as number, "TestShop 2", "shop for Tests", "Beer Sheva", "En li kesef") as number
        let shopID3 = system.addShop(originOwner as number, "TestShop 3", "shop for Tests", "Beer Sheva", "En li kesef") as number

        system.addProduct(originOwner, shopID1, "TV1", "Best desc", 1110, ["not monitors"], 111)
        system.addProduct(originOwner, shopID2, "TV2", "Best desc", 2202, ["monitors"], 222)
        system.addProduct(originOwner, shopID3, "TV3", "Best desc", 3303, ["monitors"], 333)
    })
    // expect(system.searchItemFromShops(SearchTypes.name, "TV1").length == 1 &&
    //     system.searchItemFromShops(SearchTypes.name, "TV1")[0].includes("TV1")).to.be.true
    // expect(system.searchItemFromShops(SearchTypes.category, "monitors").length == 2 &&
    //     system.searchItemFromShops(SearchTypes.category, "monitors")[0].includes("TV2") &&
    //     system.searchItemFromShops(SearchTypes.category, "monitors")[1].includes("TV3")).to.be.true

    it('Happy', () => {
        let result = system.filterSearch(SearchTypes.category, "monitors", [{
            filter_type: Filter_Type.AbovePrice,
            filter_value: "200"
        }, {filter_type: Filter_Type.BelowPrice, filter_value: "300"}])
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

/**
 * @Requirement https://docs.google.com/document/d/1a606MxIS5A5RrXk6Gnc3JQx27IE6jZSh0swnjZ9u9us/edit#heading=h.at2ykxq839q3
 */
describe('Guest:2.7: Basket - add a product to the basket', async () => {
    let originOwner, shopID, user;
    before(async () => {
        system = await SystemDriver.getSystem(true)
        system.performRegister("Test@test.com", "TESTER");
        originOwner = system.performLogin("Test@test.com", "TESTER") as number
        shopID = system.addShop(originOwner as number, "TestShop", "shop for Tests", "Beer Sheva", "En li kesef") as number
        system.addProduct(originOwner, shopID, "TV", "Best desc", 1000, ["monitors"], 1000)
        system.performRegister("newUser@test.com", "TESTER");
        user = system.performLogin("newUser@test.com", "TESTER") as number
    })

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
        expect(typeof bad_add == "string").to.be.true
    });
});

/**
 * @Requirement https://docs.google.com/document/d/1a606MxIS5A5RrXk6Gnc3JQx27IE6jZSh0swnjZ9u9us/edit#heading=h.v4lzagr37e31
 */
describe('Guest:2.8: Information - get info and edit the shopping basket', async () => {
    let originOwner, shopID, user, add_to_basket;
    before(async () => {
        system = await SystemDriver.getSystem(true)
        system.performRegister("Test@test.com", "TESTER");
        originOwner = system.performLogin("Test@test.com", "TESTER") as number
        shopID = system.addShop(originOwner as number, "TestShop", "shop for Tests", "Beer Sheva", "En li kesef") as number
        system.addProduct(originOwner, shopID, "TV", "Best desc", 10000, ["monitors"], 1000)
        system.performRegister("newUser@test.com", "TESTER");
        user = system.performLogin("newUser@test.com", "TESTER") as number
        add_to_basket = system.addItemToBasket(user, 0, shopID, 500)
    })
    // expect(typeof add_to_basket == "string").to.be.false

    it('Happy', () => {
        system.editShoppingCart(user, shopID, 0, 9999)
        let cart_info = system.displayShoppingCart(user) as string[][]
        expect(cart_info[0][0].includes("9999")).to.be.true
    });
    it('Sad: edit shopping cart for non-existing shop', () => {
        let sad_edit = system.editShoppingCart(user, 150, 0, 9999);
        expect(typeof sad_edit == "string").to.be.true;
    });
    it('Bad: edit shopping cart with negative product id', () => {
        let bad_edit = system.editShoppingCart(user, 150, -125, -21321);
        expect(typeof bad_edit == "string").to.be.true
    });
});

/**
 * @Requirement https://docs.google.com/document/d/1a606MxIS5A5RrXk6Gnc3JQx27IE6jZSh0swnjZ9u9us/edit#heading=h.42ad4kghyt0k
 */
describe('Guest:2.9.1: Purchase - buy a specific basket', () => {
    let system, originOwner, shopID, user, add_to_basket;
    before(async () => {
        system = await SystemDriver.getSystem(true);
        system.performRegister("Test@test.com", "TESTER");
        originOwner = system.performLogin("Test@test.com", "TESTER") as number
        shopID = system.addShop(originOwner as number, "TestShop", "shop for Tests", "Beer Sheva", "En li kesef") as number
        system.addProduct(originOwner, shopID, "TV", "Best desc", 1000, ["monitors"], 1000)
        system.addProduct(originOwner, shopID, "4KTV", "Best desc", 1, ["monitors"], 1000)
        system.addProduct(originOwner, shopID, "8KTV", "Best desc", 0, ["monitors"], 1000)
        system.performRegister("newUser@test.com", "TESTER");
        user = system.performLogin("newUser@test.com", "TESTER") as number
        add_to_basket = system.addItemToBasket(user, 0, shopID, 500)
    })

    // expect(typeof add_to_basket == "string").to.be.false

    it('Happy', (done) => {
        PublisherImpl.getInstance(true);
        system.purchaseShoppingBasket(user, shopID, "hello")
            .then(purchase => {
                expect(typeof purchase == "boolean").to.be.true
                expect(PublisherImpl.getInstance().getNotifications(user).length).to.be.eq(100)
                done()
            })
    });
    it('Sad: two people buying one product', () => {
        system.performRegister("oneUser@test.com", "TESTER");
        system.performRegister("secondUser@test.com", "TESTER");
        let user_one = system.performLogin("oneUser@test.com", "TESTER") as number
        system.addItemToBasket(user, 1, shopID, 1)
        let user_two = system.performLogin("secondUser@test.com", "TESTER") as number
        system.addItemToBasket(user_two, 1, shopID, 1)
        system.purchaseShoppingBasket(user_one, shopID, "hello")
            .then(purchase_one => {
                system.purchaseShoppingBasket(user_two, shopID, "hello")
                    .then(purchase_two => {
                        expect(typeof purchase_one == "string").to.be.true
                        expect(typeof purchase_two == "boolean").to.be.true;
                    })
            })
    });
    it('Sad: buy basket from non-existing shop', () => {
        system.purchaseShoppingBasket(user, 152, "hello")
            .then(sad_purchase => expect(sad_purchase).to.be.eq(BasketDoesntExists))
    });
    it('Sad: try to buy when inventory is empty', () => {
        // add the 8kTV product with empty inventory to basket
        let fail = system.addItemToBasket(user, 2, shopID, 1)
        expect(typeof fail == "string").to.be.true;
    });
    it('Bad: buy a basket with negative user id', () => {
        system.purchaseShoppingBasket(-150, 152, "hello")
            .then(bad_purchase => expect(typeof bad_purchase == "string").to.be.true)  // bad
    });
});

const getNewItem = (shop: ShopInventory): number => shop.products.reduce((acc, product) => Math.max(product.product_id, acc), -1);


/**
 * @Requirement https://docs.google.com/document/d/1a606MxIS5A5RrXk6Gnc3JQx27IE6jZSh0swnjZ9u9us/edit#heading=h.fmvdxw7c1e2c
 */
describe('Guest:2.9.2: Auction - add a bid to an auction', () => {
    let system: System, originOwner: number, shopID: number, user: number
    beforeEach(async () => {
        system = await SystemDriver.getSystem(true);
        system.performRegister("Test@test.com", "TESTER");
        originOwner = system.performLogin("Test@test.com", "TESTER") as number
        shopID = system.addShop(originOwner as number, "TestShop", "shop for Tests", "Beer Sheva", "En li kesef") as number
        system.addProduct(originOwner, shopID, "TV", "Best desc", 1000, ["monitors"], 1000)
        system.performRegister("newUser@test.com", "TESTER");
        user = system.performLogin("newUser@test.com", "TESTER") as number
    })
    it('Happy', async () => {
        let ret = system.makeOffer(user, shopID, ProductImpl._product_id_specifier - 1, 1, 999)
        expect(typeof ret != "string").to.be.true
        ret = system.acceptOfferAsManagement(originOwner, shopID, offer_id_counter - 1)
        expect(typeof ret != "string").to.be.true
        ret = await system.purchaseOffer(user, offer_id_counter - 1, "ApplePay")
        expect((system.userOrderHistory(user) as string[]).length == 1).to.be.true
    });
    it('Sad', async () => {
        let ret = system.makeOffer(user, shopID, ProductImpl._product_id_specifier - 1, 1, 999)
        expect(typeof ret != "string").to.be.true
        ret = system.denyOfferAsManagement(originOwner, shopID, offer_id_counter - 1)
        expect(typeof ret != "string").to.be.true
        ret = await system.purchaseOffer(user, offer_id_counter - 1, "ApplePay")
        expect((system.userOrderHistory(user) as string[]).length == 0).to.be.true
    });
    it('Bad', async () => {
        let ret = system.makeOffer(user, shopID, ProductImpl._product_id_specifier - 1, 1, 999)
        expect(typeof ret != "string").to.be.true
        ret = system.removeProduct(originOwner, shopID, ProductImpl._product_id_specifier - 1)
        expect(typeof ret != "string").to.be.true
        ret = await system.purchaseOffer(user, offer_id_counter - 1, "ApplePay")
        expect(typeof ret == "string").to.be.true
    });
});

/**
 * @Requirement https://docs.google.com/document/d/1a606MxIS5A5RrXk6Gnc3JQx27IE6jZSh0swnjZ9u9us/edit#heading=h.xt24dfblxfxf
 */
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

/**
 * @Requirement https://docs.google.com/document/d/1a606MxIS5A5RrXk6Gnc3JQx27IE6jZSh0swnjZ9u9us/edit#heading=h.gm1b34nj0qnb
 */
describe('Guest:2.9.4: Offer -  credit card charged, product added to purchase history', async () => {
    it('Happy', () => {

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

/**
 * @Requirement https://docs.google.com/document/d/1a606MxIS5A5RrXk6Gnc3JQx27IE6jZSh0swnjZ9u9us/edit#heading=h.hgiw4joxyqf2
 */
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

/**
 * @Requirement https://docs.google.com/document/d/1a606MxIS5A5RrXk6Gnc3JQx27IE6jZSh0swnjZ9u9us/edit#heading=h.xyyae6ahg1fy
 */
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

/**
 * @Requirement https://docs.google.com/document/d/1a606MxIS5A5RrXk6Gnc3JQx27IE6jZSh0swnjZ9u9us/edit#heading=h.f44dar7n7g1d
 */
describe('Guest:2.9.7: Discount - price changed by discount policy', async () => {
    let userID, badUI, shopID;
    before(async () => {
        system = await SystemDriver.getSystem(true)
        system.performRegister("Test@test.com", "TESTER");
        system.performRegister("Test1@test.com", "TESTER");
        userID = system.performLogin("Test@test.com", "TESTER") as number
        badUI = system.performLogin("Test1@test.com", "TESTER") as number

        shopID = system.addShop(userID as number, "TestShop", "shop for Tests", "Beer Sheva", "En li kesef") as number

        system.addProduct(userID, shopID, "TV", "Best desc", 1000, ["monitors"], 1000)

    })

    it('Happy', () => {
        system.addDiscount(userID, shopID, 0.5)
        system.addItemToBasket(userID, ProductImpl._product_id_specifier - 1, shopID, 1)
        system.purchaseCart(userID, "something").then(_ => {
            let res = (system.userOrderHistory(userID) as string[])
            console.log(res)
            expect(typeof res != "string").to.be.true
            expect(res.some(p => p.includes("500"))).to.be.true
        })
    })

    it('Sad', () => {
        //coupon discount not available
    });
    it('Bad', () => {
        //discounts no longer support end date
    });
});

/**
 * @Requirement https://docs.google.com/document/d/1a606MxIS5A5RrXk6Gnc3JQx27IE6jZSh0swnjZ9u9us/edit#heading=h.b7k2c1ahkere
 */
describe('Registered:3.1: Logout - user success to logout', () => {
    it('Happy', async () => {
        const system: System = await SystemDriver.getSystem(true);
        let reg = system.performRegister("Test@test.com", "TESTER");
        let user = system.performLogin("Test@test.com", "TESTER");
        expect(typeof user == "string").to.be.false
        system.logout(0)//good
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

/**
 * @Requirement https://docs.google.com/document/d/1a606MxIS5A5RrXk6Gnc3JQx27IE6jZSh0swnjZ9u9us/edit#heading=h.i5sb3n24ktz2
 */
describe('Registered:3.2: Open shop - add a new shop to the system, add the user as original owner', async () => {
    let reg, user;
    before(async () => {
        system = await SystemDriver.getSystem(true)
        reg = system.performRegister("Test@test.com", "TESTER");
        user = system.performLogin("Test@test.com", "TESTER");
    })

    it('Happy', () => {
        let shopID = system.addShop(user as number, "TestShop", "shop for tests", "Beer Sheva", "En li kesef");
        expect(typeof shopID == "number").to.be.true
        expect(typeof (system.getShopInfo(shopID as number)) == "string").to.be.false
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

/**
 * @Requirement https://docs.google.com/document/d/1a606MxIS5A5RrXk6Gnc3JQx27IE6jZSh0swnjZ9u9us/edit#heading=h.ae947ro82n2j
 */
describe('Registered:3.7: Information - get the purchase history', async () => {
    let originOwner, shopID, user, result;
    before(async () => {
        system = await SystemDriver.getSystem(true)
        system.performRegister("Test@test.com", "TESTER");
        originOwner = system.performLogin("Test@test.com", "TESTER") as number
        shopID = system.addShop(originOwner as number, "TestShop", "shop for Tests", "Beer Sheva", "En li kesef") as number
        system.addProduct(originOwner, shopID, "TV", "Best desc", 1000, ["monitors"], 1000)
        system.performRegister("newUser@test.com", "TESTER");
        user = system.performLogin("newUser@test.com", "TESTER") as number
        system.addItemToBasket(user, 0, shopID, 500)
        result = system.userOrderHistory(user) as string[]
        // expect(result[0]).to.be.eq("Empty order history") // TODO : is it count as sad test?
    })

    it('Happy', () => {
        system.purchaseShoppingBasket(user, shopID, "hello")
            .then(_ => {
                result = system.userOrderHistory(user) as string[]
                expect(result[0]).to.be.not.eq("Empty order history")
                expect(result[0].includes("TV")).to.be.true
            })
    });
    it('Sad: ', () => {
        //TODO
    });
    it('Bad', () => {
        //TODO
    });
});

/**
 * @Requirement https://docs.google.com/document/d/1a606MxIS5A5RrXk6Gnc3JQx27IE6jZSh0swnjZ9u9us/edit#heading=h.cvl6sukqtukq
 */
describe('Owner:4.1.1: Product - add a new product to the shop', async () => {
    let reg, userID, shopID, items;
    before(async () => {
        system = await SystemDriver.getSystem(true)
        reg = system.performRegister("Test@test.com", "TESTER");
        userID = system.performLogin("Test@test.com", "TESTER") as number
        shopID = system.addShop(userID as number, "TestShop", "shop for Tests", "Beer Sheva", "En li kesef") as number
        items = system.getItemsFromShop(shopID) as string[]
    })
    // expect(items.some(p=>p.includes("TV"))).to.be.false

    it('Happy', () => {
        const res = system.addProduct(userID, shopID, "TV", "Best desc", 1000, ["monitors"], 1000)
        expect(typeof res == "boolean").to.be.true
        items = system.getItemsFromShop(shopID) as string[]
        expect(items.some(p => p.includes("TV"))).to.be.true
    });
    it('Sad: add a product with empty name ', () => {
        const sad_res = system.addProduct(userID, shopID, "", "Best desc", 1000, ["monitors"], 1000)
        expect(typeof sad_res == "string").to.be.true
    });
    it('Bad: add a product with a guest user', () => {
        let guest = system.performGuestLogin();
        const bad_res = system.addProduct(guest, shopID, "TV", "Best desc", 1000, ["monitors"], 1000)
        expect(typeof bad_res == "string").to.be.true
    });
});

/**
 * @Requirement https://docs.google.com/document/d/1a606MxIS5A5RrXk6Gnc3JQx27IE6jZSh0swnjZ9u9us/edit#heading=h.qbpk2vkeb2fw
 */
describe('Owner:4.1.2: Product - remove a product from the shop', async () => {
    let reg, userID, shopID, res;
    before(async () => {
        system = await SystemDriver.getSystem(true)
        reg = system.performRegister("Test@test.com", "TESTER");
        userID = system.performLogin("Test@test.com", "TESTER") as number
        shopID = system.addShop(userID as number, "TestShop", "shop for Tests", "Beer Sheva", "En li kesef") as number
        res = system.addProduct(userID, shopID, "TV", "Best desc", 1000, ["monitors"], 1000)
    })

    // let items = system.getItemsFromShop(shopID) as string[]
    // expect(items.some(p=>p.includes("TV"))).to.be.true
    it('Happy', () => {
        system.removeProduct(userID, shopID, 0) //we know that it's 0 as we reset the tests every time
        expect((system.getItemsFromShop(shopID) as string[]).some(p => p.includes("TV"))).to.be.false
    });
    it('Bad: remove a product with invalid product id', () => {
        system.addProduct(userID, shopID, "TV", "Best desc", 1000, ["monitors"], 1000)
        system.removeProduct(userID, shopID, -1)
        expect((system.getItemsFromShop(shopID) as string[]).some(p => p.includes("TV"))).to.be.true
    });
});

/**
 * @Requirement https://docs.google.com/document/d/1a606MxIS5A5RrXk6Gnc3JQx27IE6jZSh0swnjZ9u9us/edit#heading=h.pjhgqs8jkxha
 */
describe('Owner:4.2.1: Purchase policy - add a new purchase policy to the shop', async () => {
    let userID, badUI, shopID;
    before(async () => {
        system = await SystemDriver.getSystem(true)
        system.performRegister("Test@test.com", "TESTER");
        system.performRegister("Test1@test.com", "TESTER");
        userID = system.performLogin("Test@test.com", "TESTER") as number
        badUI = system.performLogin("Test1@test.com", "TESTER") as number
        shopID = system.addShop(userID as number, "TestShop", "shop for Tests", "Beer Sheva", "En li kesef") as number
    })

    it('Happy', () => {
        system.addPurchasePolicy(userID, shopID, ConditionType.NotCategory, "GTX")
        expect((system.getAllPurchasePolicies(userID, shopID) as string[]).some(p => p.includes("GTX")))
        system.addPurchasePolicy(userID, shopID, ConditionType.GreaterAmount, "666")
        system.composePurchasePolicy(userID, shopID, id_counter - 1, id_counter - 2, Operator.Or)
        expect((system.getAllPurchasePolicies(userID, shopID) as string[]).some(p => p.includes("GTX") && p.includes("666") && p.toLowerCase().includes("or")))
    });
    it('Sad', () => {
        system.addPurchasePolicy(userID, shopID, ConditionType.LowerAmount, "GTO")
        expect((system.getAllPurchasePolicies(userID, shopID) as string[]).every(p => !p.includes("GTO")))
    });
    it('Bad', () => {
        system.addPurchasePolicy(badUI, shopID, ConditionType.NotCategory, "SUPERGTA")
        expect((system.getAllPurchasePolicies(badUI, shopID) as string[]).some(p => p.includes("SUPERGTA")))
    });
});

/**
 * @Requirement https://docs.google.com/document/d/1a606MxIS5A5RrXk6Gnc3JQx27IE6jZSh0swnjZ9u9us/edit#heading=h.t7p40iokqml
 */
describe('Owner:4.2.2: Discount policy - add a new discount policy to the shop', async () => {
    let userID, badUI, shopID;
    before(async () => {
        system = await SystemDriver.getSystem(true)
        system.performRegister("Test@test.com", "TESTER");
        system.performRegister("Test1@test.com", "TESTER");
        userID = system.performLogin("Test@test.com", "TESTER") as number
        badUI = system.performLogin("Test1@test.com", "TESTER") as number
        shopID = system.addShop(userID as number, "TestShop", "shop for Tests", "Beer Sheva", "En li kesef") as number
    })

    it('Happy', () => {
        system.addDiscount(userID, shopID, 0.5)
        expect((system.getAllDiscounts(userID, shopID) as string[]).some(d => d.includes("0.5")))
        system.addConditionToDiscount(userID, shopID, DiscountHandler.discountCounter - 1, Condition.Product_Name, "NICE")
        expect((system.getAllDiscounts(userID, shopID) as string[]).some(d => d.includes("NICE")))
        system.addDiscount(userID, shopID, 0.6)
        system.addLogicComposeDiscount(userID, shopID, LogicComposition.XOR, DiscountHandler.discountCounter - 1, DiscountHandler.discountCounter - 2)
        expect((system.getAllDiscounts(userID, shopID) as string[]).some(d => d.toLowerCase().includes("xor")))
        system.addDiscount(userID, shopID, 0.7)
        system.addNumericComposeDiscount(userID, shopID, NumericOperation.Add, DiscountHandler.discountCounter - 1, DiscountHandler.discountCounter - 2)
        expect((system.getAllDiscounts(userID, shopID) as string[]).some(d => d.toUpperCase().includes("add")))
    });
    it('Sad', () => {
        system.addDiscount(userID, shopID, 1.5)
        expect((system.getAllDiscounts(userID, shopID) as string[]).every(d => !d.includes("1.5")))
    });
    it('Bad', () => {
        system.addDiscount(badUI, shopID, 1.5)
        expect((system.getAllDiscounts(badUI, shopID) as string[]).every(d => !d.includes("1.5")))
    });
});

/**
 * @Requirement https://docs.google.com/document/d/1a606MxIS5A5RrXk6Gnc3JQx27IE6jZSh0swnjZ9u9us/edit#heading=h.bwzt9iy9meym
 */
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

/**
 * @Deprecated
 * @Requirement https://docs.google.com/document/d/1a606MxIS5A5RrXk6Gnc3JQx27IE6jZSh0swnjZ9u9us/edit#heading=h.4oq7i6nhf3ow
 */
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

/**
 * @Requirement https://docs.google.com/document/d/1a606MxIS5A5RrXk6Gnc3JQx27IE6jZSh0swnjZ9u9us/edit#heading=h.lo3otnn7xt7k
 */
describe('Owner:4.3: Appoint - appoint a new owner to the shop', async () => {
    let reg, userID, shopID;
    before(async () => {
        system = await SystemDriver.getSystem(true)
        //Original owner
        reg = system.performRegister("Test@test.com", "TESTER");
        userID = system.performLogin("Test@test.com", "TESTER") as number
        shopID = system.addShop(userID as number, "TestShop", "shop for tests", "Beer Sheva", "En li kesef") as number
    })

    it('Happy', () => {
        //create new employee and appoint him as an owner
        let newEmp = system.performRegister("OvedMetzuyan@post.co.il", "123")
        let nEmpID = system.performLogin("OvedMetzuyan@post.co.il", "123") as number
        let res = system.addProduct(nEmpID, shopID, "TV", "Best desc", 1000, ["monitors"], 1000)
        expect(typeof res == "string").to.be.true
        expect(typeof (system.appointOwner(userID, shopID, "OvedMetzuyan@post.co.il")) == "boolean").to.be.true
        res = system.addProduct(nEmpID, shopID, "TV", "Best desc", 1000, ["monitors"], 1000)
        expect(typeof res == "string").to.be.false
    });
    it('Sad: appoint an already owner user as an owner', () => {
        let sad_appoint = system.appointOwner(userID, shopID, "OvedMetzuyan@post.co.il")
        expect(typeof sad_appoint == "string").to.be.true
    });
    it('Bad: appoint user with a user that is not the owner of the shop', () => {
        let anotherNewEmp = system.performRegister("OvedRa@post.co.il", "123")
        let anoutherEmpID = system.performLogin("OvedRa@post.co.il", "123") as number
        let anotherAnotherNewEmp = system.performRegister("OvedRaMeod@post.co.il", "123")
        let anotherAnoutherEmpID = system.performLogin("OvedRaMeod@post.co.il", "123") as number
        let bad_appoint = system.appointOwner(anoutherEmpID, shopID, "OvedRaMeod@post.co.il")
        expect(typeof bad_appoint == "string").to.be.true
    });
});

/**
 * @Requirement https://docs.google.com/document/d/1a606MxIS5A5RrXk6Gnc3JQx27IE6jZSh0swnjZ9u9us/edit#heading=h.4fpux52hueow
 */
describe('Owner:4.5: Appoint - appoint a new manager to the shop', async () => {
    let reg, userID, shopID;
    before(async () => {
        system = await SystemDriver.getSystem(true)
        //Original owner
        reg = system.performRegister("Test@test.com", "TESTER");
        userID = system.performLogin("Test@test.com", "TESTER") as number
        shopID = system.addShop(userID as number, "TestShop", "shop for tests", "Beer Sheva", "En li kesef") as number
    })

    it('Happy', () => {
        //create new employee
        let newEmp = system.performRegister("OvedMetzuyan@post.co.il", "123")
        let nEmpID = system.performLogin("OvedMetzuyan@post.co.il", "123") as number
        let shopInfo = (system.getShopInfo(shopID) as string[])[0]
        expect(shopInfo.indexOf("Managers:") < shopInfo.indexOf("OvedMetzuyan@post.co.il")).to.be.false
        expect(typeof (system.appointManager(userID, shopID, "OvedMetzuyan@post.co.il")) == "boolean").to.be.true
        shopInfo = (system.getShopInfo(shopID) as string[])[0]
        expect(shopInfo.indexOf("Managers:") < shopInfo.indexOf("OvedMetzuyan@post.co.il")).to.be.true
    });
    it('Sad: appoint a user as a manager that is already a manager of the shop ', () => {
        let sad_appoint = system.appointManager(userID, shopID, "OvedMetzuyan@post.co.il")
        expect(typeof sad_appoint == "string").to.be.true //sad
    });
    it('Bad: appoint a user as a manager with a user that is not an owner of the shop', () => {
        system.performRegister("OvedRa@post.co.il", "123")
        let anoutherEmpID = system.performLogin("OvedRa@post.co.il", "123") as number
        system.performRegister("OvedRaMeod@post.co.il", "123")
        system.performLogin("OvedRaMeod@post.co.il", "123") as number
        let bad_appoint = system.appointManager(anoutherEmpID, shopID, "OvedRaMeod@post.co.il")
        expect(typeof bad_appoint == "string").to.be.true //bad
    });
});

/**
 * @Requirement https://docs.google.com/document/d/1a606MxIS5A5RrXk6Gnc3JQx27IE6jZSh0swnjZ9u9us/edit#heading=h.2wragr7iuuf5
 */
describe('Owner:4.6: Manager permissions - modify a manager permission', async () => {
    let originalOwner, shopID;
    before(async () => {
        system = await SystemDriver.getSystem(true)
        system.performRegister("Test@test.com", "TESTER");
        originalOwner = system.performLogin("Test@test.com", "TESTER") as number
        shopID = system.addShop(originalOwner as number, "TestShop", "shop for tests", "Beer Sheva", "En li kesef") as number
    })

    it('Happy', () => {
        //create new employee
        let newEmp = system.performRegister("OvedMetzuyan@post.co.il", "123")
        let nEmpID = system.performLogin("OvedMetzuyan@post.co.il", "123") as number
        expect(typeof (system.appointManager(originalOwner, shopID, "OvedMetzuyan@post.co.il")) == "boolean").to.be.true
        let res = system.addProduct(nEmpID, shopID, "TV", "Best desc", 1000, ["monitors"], 1000)
        expect(typeof res == "string").to.be.true
        expect(typeof system.addPermissions(originalOwner, shopID, "OvedMetzuyan@post.co.il", Action.AddItem) == "boolean").to.be.true
        res = system.addProduct(nEmpID, shopID, "TV", "Best desc", 1000, ["monitors"], 1000)
        expect(typeof res == "string").to.be.false
    });
    it('Sad: add the same permissions', () => {
        //In case of failure, is it related to the happy test flow?
        let prev = system.getShopInfo(shopID)[0] as string
        system.addPermissions(originalOwner, shopID, "OvedMetzuyan@post.co.il", Action.AddItem)
        let cur = system.getShopInfo(shopID)[0] as string
        expect(prev).eq(cur)
    });
    it('Bad: modify a manager permissions with a user that is not an owner of the shop', () => {
        let otherOwner = system.performRegister("OvedaMetzuyan@post.co.il", "123")
        let differentId = system.performLogin("OvedaMetzuyan@post.co.il", "123") as number
        system.appointOwner(originalOwner, shopID, "OvedaMetzuyan@post.co.il")
        let bad = system.addPermissions(differentId, shopID, "OvedMetzuyan@post.co.il", Action.RemoveItem)
        expect(typeof bad == "string").to.be.true
    });
});

/**
 * @Requirement https://docs.google.com/document/d/1a606MxIS5A5RrXk6Gnc3JQx27IE6jZSh0swnjZ9u9us/edit#heading=h.euh2924jrgbs
 */
describe('Owner:4.7: Manager - remove a manager from the shop', async () => {
    let reg, userID, shopID;
    before(async () => {
        system = await SystemDriver.getSystem(true)
        PublisherImpl.getInstance(true)
        //Original owner
        reg = system.performRegister("Test@test.com", "TESTER");
        userID = system.performLogin("Test@test.com", "TESTER") as number
        shopID = system.addShop(userID as number, "TestShop", "shop for tests", "Beer Sheva", "En li kesef") as number
        //WHY DAFUQ DOES IT RUN PURCHASE
    })
    it('Happy', () => {
        //create new employee
        let newEmp = system.performRegister("OvedMetzuyan1@post.co.il", "123")
        let nEmpID = system.performLogin("OvedMetzuyan1@post.co.il", "123") as number
        expect(typeof (system.appointManager(userID, shopID, "OvedMetzuyan1@post.co.il")) == "boolean").to.be.true
        expect(PublisherImpl.getInstance().getNotifications(nEmpID).length).to.be.eq(0)
        system.removeManager(userID, shopID, "OvedMetzuyan1@post.co.il")
        let shopInfo = (system.getShopInfo(shopID) as string[])[0]
        expect(shopInfo.indexOf("Managers:") < shopInfo.indexOf("OvedMetzuyan1@post.co.il")).to.be.false
        expect(PublisherImpl.getInstance().getNotifications(nEmpID).length).to.be.eq(1)
    });
    it('Sad: remove non-manager user from managment of the shop', () => {
        expect(typeof (system.removeManager(userID, shopID, "noone@post.co.il")) == "string").to.be.true
    });
    it('Bad: remove a manager with a user that is not an owner of the shop', () => {
        let other = system.performRegister("aaaa@post.co.il", "123")
        let otherId = system.performLogin("aaaa@post.co.il", "123") as number
        let newEmp = system.performRegister("OvedMetzuyan2@post.co.il", "123")
        let nEmpID = system.performLogin("OvedMetzuyan2@post.co.il", "123") as number
        expect(typeof (system.removeManager(otherId, shopID, "OvedMetzuyan2@post.co.il")) == "string").to.be.true
    });
});

/**
 * @Requirement https://docs.google.com/document/d/1a606MxIS5A5RrXk6Gnc3JQx27IE6jZSh0swnjZ9u9us/edit#heading=h.etex5wv38yvq
 */
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

/**
 * @Requirement https://docs.google.com/document/d/1a606MxIS5A5RrXk6Gnc3JQx27IE6jZSh0swnjZ9u9us/edit#heading=h.r85xeoe2dfkc
 */
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

/**
 * @Requirement https://docs.google.com/document/d/1a606MxIS5A5RrXk6Gnc3JQx27IE6jZSh0swnjZ9u9us/edit#heading=h.tqiiku4j47bq
 */
describe('Admin:6.4.1: Information - gets a purchase history of a given user', async () => {
    let originOwner, shopID, user, add_to_basket, purchase, admin;
    before(async () => {
        system = await SystemDriver.getSystem(true)
        system.performRegister("Test@test.com", "TESTER");
        originOwner = system.performLogin("Test@test.com", "TESTER") as number
        shopID = system.addShop(originOwner as number, "TestShop", "shop for Tests", "Beer Sheva", "En li kesef") as number
        system.addProduct(originOwner, shopID, "TV", "Best desc", 1000, ["monitors"], 1000)
        system.performRegister("newUser@test.com", "TESTER");
        user = system.performLogin("newUser@test.com", "TESTER") as number
        add_to_basket = system.addItemToBasket(user, ProductImpl._product_id_specifier - 1, shopID, 500)
        // expect(typeof add_to_basket == "string").to.be.false
        purchase = system.purchaseShoppingBasket(user, shopID, "hello")
        // expect(typeof purchase == "boolean").to.be.true
        admin = system.performLogin("admin@gmail.com", "admin") as number
    })

    it('Happy', () => {
        let result = system.adminDisplayUserHistory(admin, user)
        expect(result.length).to.be.eq(1)
    });
    it('Sad:get a purchase history from not existing user', () => {
        let sad_result = system.adminDisplayUserHistory(admin, 150)
        expect(typeof sad_result == "string").to.be.true
    });
    it('Bad: get a purchase history with non-admin user', () => {
        let bad_result = system.adminDisplayUserHistory(150, user)
        expect(typeof bad_result == "string").to.be.true
    });
});

/**
 * @Requirement https://docs.google.com/document/d/1a606MxIS5A5RrXk6Gnc3JQx27IE6jZSh0swnjZ9u9us/edit#heading=h.abnn9wn6l8rl
 */
describe('Admin:6.4.2: Information - gets a purchase history of a given shop', async () => {
    let originOwner, shopID, user, purchase, add_to_basket, admin;
    before(async () => {
        system = await SystemDriver.getSystem(true)
        system.performRegister("Test@test.com", "TESTER");
        originOwner = system.performLogin("Test@test.com", "TESTER") as number
        shopID = system.addShop(originOwner as number, "TestShop", "shop for Tests", "Beer Sheva", "En li kesef") as number
        system.addProduct(originOwner, shopID, "TV", "Best desc", 1000, ["monitors"], 1000)
        system.performRegister("newUser@test.com", "TESTER");
        user = system.performLogin("newUser@test.com", "TESTER") as number
        add_to_basket = system.addItemToBasket(user, 0, shopID, 500)
        expect(typeof add_to_basket == "string").to.be.false
        purchase =await system.purchaseShoppingBasket(user, shopID, "hello")
        expect(typeof purchase == "boolean").to.be.true
        admin = system.performLogin("admin@gmail.com", "admin") as number
    })
    it('Happy', () => {
        let result = system.adminDisplayShopHistory(admin, shopID) as string[]
        expect(result.length).to.be.eq(1)
    });
    it('Sad: get a purchase history from non-existing shop', () => {
        let sad_result = system.adminDisplayShopHistory(admin, 150)
        expect(typeof sad_result == "string").to.be.true
    });
    it('Bad: get a purchase history with non-admin user', () => {
        let bad_result = system.adminDisplayShopHistory(12, shopID)
        expect(typeof bad_result == "string").to.be.true
    });
});

describe('Services:Payment Handler', () => {
    let user, shopID, add_to_basket;
    before(async () => {
        system = await SystemDriver.getSystem(true)
        system.performRegister("Test@test.com", "TESTER");
        user = system.performLogin("Test@test.com", "TESTER") as number
        shopID = system.addShop(user as number, "TestShop", "shop for tests", "Beer Sheva", "En li kesef") as number
        system.addProduct(user, shopID,"TV", "Best desc", 1000, ["monitors"],1000)
        add_to_basket = system.addItemToBasket(user, 0, shopID, 200)
        expect(typeof add_to_basket == "string").to.be.false
    })

    it('Happy', async () => {
        //TODO milestone 2
        await system.purchaseShoppingBasket(user, shopID, "MOCK was charged successfully")
            .then(purchase => expect(purchase).to.be.true)
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
    before(async () => {
        system = await SystemDriver.getSystem(true)
    })

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

describe('Services: delivery', () => {
    let originOwner, shopID, user;
    before(async () => {
        system = await SystemDriver.getSystem(true)
        system.performRegister("Test@test.com", "TESTER");
        originOwner = system.performLogin("Test@test.com", "TESTER") as number
        shopID = system.addShop(originOwner as number, "TestShop", "shop for Tests", "Beer Sheva", "En li kesef") as number
        system.addProduct(originOwner, shopID,"8KTV", "Best desc", 0, ["monitors"],1000, { expiration_date: new Date(), percent: 0, applyDiscount(price: number): number { return 0; }, can_be_applied(value: any): boolean { return false;  } })
        system.performRegister("newUser@test.com", "TESTER");
        user = system.performLogin("newUser@test.com", "TESTER") as number
        system.addItemToBasket(user, 0, shopID, 500)
    })

    it('Happy', () => {
        let delivery = system.deliverItem(0,50, 0, "Beer Sheva Arlozorov 54",true);
        expect(delivery).to.be.true;
    });

    it('Sad: negative amount', () => {
        let delivery = system.deliverItem(0,-50, 0, "Beer Sheva Arlozorov 26",true);
        expect(delivery).to.be.false;
    });

    it('Sad: purchase failed product not delivered.', () => {
        let transaction = system.purchaseShoppingBasket(-150, 152, "MOCK");
        let delivery = system.deliverItem( 0,50, 0, "Beer Sheva Arlozorov 54", transaction);
        expect(delivery).to.be.false;
    });

    it('Bad: injection', () => {
        let delivery = system.deliverItem(0,50, 0, "Drop table",true);
        expect(delivery).to.be.false;
    });
});