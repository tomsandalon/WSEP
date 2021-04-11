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

    it('2.6: Search - search an item by name and get all the shops that sells it', () => {

    });

    it('2.7: Basket - add a produt to the basket', () => {
        //user.addToBasket(shopID,productID,amount);
        //expect(user.getBasket().getProduct()).not.equal(null);
        //expect(user.getBasket().getProduct().getAmount()).equal.(amount);
        //expect(ShopInventory.addItem(productID, largeAmount)).to.be.false;
        //expect(ShopInventory.addItem(productID, negativeAmount)).to.be.false;
    });

    it('2.8: Information - get info and edit the shopping basket', () => {

    });

    it('2.9.1: Purchase - buy a specific basket', () => {
        //user.addToBasket(shopID,productID,amount);
        //user.purchaseBasket(shopID,payment_method).to.be.true;
        //FIXME: puchase basket by name
        //user.purchaseBasket(shopID,WrongBasketName).to.be.false;
    });

    it('2.9.2: Auction - add a bid to an auction', () => {
        //expect(shop.addBid(productID, amount, paymentInfo)).to.be.true;
        //expect(shop.addBid(productID, lowerAmount, paymentInfo)).to.be.false;

    });

    it('2.9.3: Auction - credit card charged, product added to purchase history', () => {
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
        //assuming user submmision reach the goal price and the user is the winner
        //let balance = service.paymentService.getBalance();
        //shop.buyLotteryTicket(productID, submission);
        //expect(service.paymentBalance.getBalance()).equal(balance - submission);
        //expect(user.getPurchaseHistory().contains(productID)).to.be.true;
        //expect(shop.buyLotteryTicket(productID, largeSubmission)).to.be.false; //sad path ?? 
        //expect(shop.buyLotteryTicket(productID, largeSubmission)).to.be.false; //item removed = bad path ?? 
    });

    it('2.9.6: Lottery - credit card charged, product added to purchase history', () => {
        //the difference from 2.9.5?
    });

    it('2.9.7: Discount - price changed by discount policy', () => {
        //expect(shop.getDiscountedPrice(productID)).not.equal(shop.getPrice(productID));
    });
});

describe('Registered:', () => {
    it('3.1: Logout - user success to logout ', () => {
        // let reg = register("Test@test.com", "TESTER");
        // let user = login("Tester@test.com", "TESTER");
        //Login.logout(user.email);
        // expect(user).equal(null);
    });

    it('3.2: Open shop - add a new shop to the system, add the user as original owner', () => {
        //let SID = System.addShop(user.user_email, user.name, description,location, bank_info);
        //expect(SID).not.equal(null);
        //expect(ShopManagement(isOwner(user))).to.be.true;
        //let SID = System.addShop(user.user_email, user.name, description,location, corruptBankInfo);
        //expect(SID).equal(null);
    });

    it('3.7: Information - get the purchase history', () => {

    });
});

describe('Owner:', () => {
    it('4.1.1: Product - add a new product to the shop', () => {
        //ShopInventory.addItem(productID,amount);
        //expect(ShopInventory.hasProduct(productID)).equal(amount);
        //expect(ShopInventory.addItem(productID,amount,wrongPurchaseType)).to.be.false;
        //let user = notAnOwner
        //expect(ShopInventory.addItem(productID,amount)).to.be.false;
    });

    it('4.1.2: Product - remove a product from the shop', () => {
        //let oldAmount = ShopInventory.getAmount(productID);
        //ShopInventory.removeItem(productID,amount);
        //expect(ShopInventory.hasProduct(productID)).equal(oldAmount - amount);
        //expect(ShopInventory.removeItem(WrongProductID)).to.be.false;
        //let user = notAnOwner
        //expect(ShopInventory.removeItem(productID,amount)).to.be.false;
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
        //expect(ShopManagmentappointNewOwner(appointier_ID,apointee_ID)).to.be.true;
        //expect(ShopManagmentappointNewOwner(appointier_ID,apointee_ID).to.be.false;//already an owner
        //user is not the owner of the shop
        //expect(ShopManagmentappointNewOwner(appointier_ID,apointee_ID).to.be.false;
    });

    it('4.5: Appoint - appoint a new manager to the shop', () => {
        //expect(ShopManagment.appointNewManager(appointier_ID, apointee_ID)).to.be.true;
        //expect(ShopManagment.appointNewManager(appointier_ID, apointee_ID)).to.be.false;//already an manager
        //user is not the owner of the shop
        //expect(ShopManagment.appointNewManager(appointier_ID, apointee_ID)).to.be.false;
    });

    it('4.6: Manager permissions - modify a manager permission', () => {
        //expect(ShopManagment.editPermissions(appointier_ID, apointee_ID, permissions)).to.be.true;
        //expect(ShopManagment.editPermissions(appointier_ID, apointee_ID, permissions)).to.be.false;//already have the permissions
        //expect(ShopManagment.editPermissions(appointier_ID, apointee_ID, permissions)).to.be.false;//apointee didnt promoted by the user
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

    });
});

describe('Services:', () => {
    it('Payment Handler', () => {

    });

    it('Spell Checker', () => {

    });
});