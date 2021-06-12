import 'mocha';
import {expect} from 'chai';
import {ProductImpl} from "../../../Logic/Domain/ProductHandling/Product";
import {Shop, ShopImpl} from "../../../Logic/Domain/Shop/Shop";
import {UserImpl} from "../../../Logic/Domain/Users/User";
import {describe} from "mocha";
import {ConditionType} from "../../../Logic/Domain/Shop/PurchasePolicy/SimpleCondition";
import {SystemImpl} from "../../../Logic/Domain/System";
import {PublisherImpl} from "../../../Logic/Domain/Notifications/PublisherImpl";
import {Notification} from '../../../Logic/Domain/Notifications/Notification';
import {history_entry, UserPurchaseHistoryImpl} from "../../../Logic/Domain/Users/UserPurchaseHistory";
import {DiscountHandler} from "../../../Logic/Domain/Shop/DiscountPolicy/DiscountHandler";
import {Condition} from "../../../Logic/Domain/Shop/DiscountPolicy/ConditionalDiscount";
import {LogicComposition} from "../../../Logic/Domain/Shop/DiscountPolicy/LogicCompositionDiscount";
import {id_counter} from "../../../Logic/Domain/Shop/ShopInventory";
import {Operator} from "../../../Logic/Domain/Shop/PurchasePolicy/CompositeCondition";


function shopsAreEquals(shop1: Shop[], shop2: Shop[]): boolean {
    const res = shop1.length == shop2.length && shop1.every(s1 => shop2.some(s2 => ShopImpl.shopsAreEquals(s1, s2)))
    return res
}

function usersAreRestored(u1: UserImpl[], u2: UserImpl[]) {
    return u1.length == u2.length && u1.every(u1 => u2.some(u2 => UserImpl.usersAreEqual(u1, u2)))
}

function notificationsAreRestored(n1: {[p: number]: Notification[]}, n2: {[p: number]: Notification[]}) {
    let size = 0
    for (let i = 0; i < Infinity; i++) {
        if (n1[i] != undefined) size = Math.max(size, i);
        else i = Infinity
    }
    for (let i = 0; i < Infinity; i++) {
        if (n2[i] != undefined) size = Math.max(size, i);
        else i = Infinity
    }
    for (let i = 0; i < size; i++) {
        if (!Notification.notificationsAreEqual(n1[i], n2[i])) return false
    }
    return true
}

function purchasesAreRestored(h1: history_entry[], h2: history_entry[]) {
    return h1.length == h2.length && h1.every(h1 => h2.some(h2 => UserPurchaseHistoryImpl.historiesAreEqual(h1, h2)))
}

describe('Rollback', async () => {
    const system: SystemImpl = SystemImpl.getInstance(true);
    describe("Test rollback", () => {
        let originOwner;
        let shopID;
        let newEmp;
        let nEmpID;
        let tester;
        let shops;
        let users;
        let notifications;
        let purchases;
        before( async () =>{
            await system.init()
            system.performRegister("Test@test.com", "TESTER");
            originOwner = system.performLogin("Test@test.com", "TESTER") as number
            shopID = system.addShop(originOwner as number, "TestShop", "shop for Tests", "Beer Sheva", "En li kesef") as number

            system.addProduct(originOwner, shopID, "TV", "Best desc", 1000, ["monitors"], 1000)
            system.addProduct(originOwner, shopID, "4KTV", "Best desc", 1, ["monitors"], 1000)
            system.addProduct(originOwner, shopID, "8KTV", "Best desc", 20, ["monitors"], 1000)
            newEmp = system.performRegister("OvedMetzuyan@post.co.il", "123")
            nEmpID = system.performLogin("OvedMetzuyan@post.co.il", "123") as number
            system.appointOwner(originOwner, shopID, "OvedMetzuyan@post.co.il")
            system.performRegister("ManagerMetzuyan@post.co.il", "123")
            system.performLogin("ManagerMetzuyan@post.co.il", "123")
            system.appointManager(nEmpID, shopID, "ManagerMetzuyan@post.co.il")
            system.performRegister("newUser@test.com", "TESTER");
            tester = system.performLogin("newUser@test.com", "TESTER") as number

            system.addDiscount(originOwner, shopID, 0.5)
            system.addDiscount(originOwner, shopID, 0.6)
            system.addDiscount(originOwner, shopID, 0.3)
            system.addConditionToDiscount(originOwner, shopID, DiscountHandler.discountCounter - 1, Condition.Amount, "10")
            system.addLogicComposeDiscount(originOwner, shopID, LogicComposition.AND, DiscountHandler.discountCounter - 1, DiscountHandler.discountCounter - 3)

            system.addPurchasePolicy(originOwner, shopID, ConditionType.NotCategory, "GTX")
            system.addPurchasePolicy(originOwner, shopID, ConditionType.GreaterAmount, "19")
            system.composePurchasePolicy(originOwner, shopID, id_counter - 1, id_counter - 2, Operator.And)

            system.addItemToBasket(tester, ProductImpl._product_id_specifier - 1, shopID, 2)
            system.purchaseCart(tester, "something")
            system.addItemToBasket(tester, ProductImpl._product_id_specifier - 2, shopID, 1)


            shops = system.shops
            users = system.login.existing_users
            notifications = PublisherImpl.getInstance().notificationQueue
            purchases = UserPurchaseHistoryImpl.getInstance().history
        })
        function timeout(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
        it("Check reconnect to db", async () => {
            // expect(false).to.be.true
            // TODO uncomment, run the test case, wait for 'Sleeping to be printed', kill DB via terminal,
            //  wait for wake up and expect to see 'Reconnecting', then start up the DB then expect mocha to pass the test
            // console.log('Sleeping')
            // await timeout(10*1000)
            // console.log('Wake up')
            // await SystemImpl.rollback()
            // expect(shopsAreEquals(shops, SystemImpl.getInstance().shops)).to.be.true
            // console.log('OK')

        })
        it("Check shops are restored", async () => {
            await SystemImpl.rollback()
            const res = shopsAreEquals(shops, SystemImpl.getInstance().shops)
            expect(res).to.be.true
        })
        it("Check users are restored", async () => {
            await SystemImpl.rollback()
            const res = usersAreRestored(users, SystemImpl.getInstance().login.existing_users)
            expect(res).to.be.true
        })
        it("Check notifications are restored", async () => {
            await SystemImpl.rollback()
            const res = notificationsAreRestored(notifications, PublisherImpl.getInstance().notificationQueue)
            expect(res).to.be.true
        })
        it("Check purchases are restored", async () => {
            await SystemImpl.rollback()
            const res = purchasesAreRestored(purchases, UserPurchaseHistoryImpl.getInstance().history)
            expect(res).to.be.true
        })
    })
})
