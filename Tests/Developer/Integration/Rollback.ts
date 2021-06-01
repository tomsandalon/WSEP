import 'mocha';
import {expect} from 'chai';
import {ProductImpl} from "../../../Logic/Domain/ProductHandling/Product";
import {Shop, ShopImpl} from "../../../Logic/Domain/Shop/Shop";
import {id_counter as user_id_counter, UserImpl} from "../../../Logic/Domain/Users/User";
import {describe} from "mocha";
import {ConditionType} from "../../../Logic/Domain/Shop/PurchasePolicy/SimpleCondition";
import {SystemImpl} from "../../../Logic/Domain/System";
import {PublisherImpl} from "../../../Logic/Domain/Notifications/PublisherImpl";
import {Notification} from '../../../Logic/Domain/Notifications/Notification';
import {history_entry, UserPurchaseHistoryImpl} from "../../../Logic/Domain/Users/UserPurchaseHistory";


function shopsAreEquals(shop1: Shop[], shop2: Shop[]): boolean {
    return shop1.length == shop2.length && shop1.every(s1 => shop2.some(s2 => ShopImpl.shopsAreEquals(s1, s2)))
}

function usersAreRestored(u1: UserImpl[], u2: UserImpl[]) {
    return u1.length == u2.length && u1.every(u1 => u2.some(u2 => UserImpl.usersAreEqual(u1, u2)))
}

function notificationsAreRestored(n1: {[p: number]: Notification[]}, n2: {[p: number]: Notification[]}) {
    const size = user_id_counter
    for (let i = 0; i < size; i++) {
        if (!Notification.notificationsAreEqual(n1[i], n2[i])) return false
    }
    return true
}

function purchasesAreRestored(h1: history_entry[], h2: history_entry[]) {
    return h1.length == h2.length && h1.every(h1 => h2.some(h2 => UserPurchaseHistoryImpl.historiesAreEqual(h1, h2)))
}

describe("Test rollback", () => {
    const system: SystemImpl = SystemImpl.getInstance(true);
    system.performRegister("Test@test.com", "TESTER");
    let originOwner = system.performLogin("Test@test.com", "TESTER") as number
    let shopID = system.addShop(originOwner as number, "TestShop", "shop for Tests", "Beer Sheva", "En li kesef") as number

    system.addProduct(originOwner, shopID,"TV", "Best desc", 1000, ["monitors"],1000)
    system.addProduct(originOwner, shopID,"4KTV", "Best desc", 1, ["monitors"],1000)
    system.addProduct(originOwner, shopID,"8KTV", "Best desc", 20, ["monitors"],1000)
    let newEmp = system.performRegister("OvedMetzuyan@post.co.il", "123")
    let nEmpID = system.performLogin("OvedMetzuyan@post.co.il", "123") as number
    system.appointOwner(originOwner, shopID,"OvedMetzuyan@post.co.il")
    system.performRegister("ManagerMetzuyan@post.co.il", "123")
    system.performLogin("ManagerMetzuyan@post.co.il", "123")
    system.appointOwner(nEmpID, shopID,"ManagerMetzuyan@post.co.il")
    system.performRegister("newUser@test.com", "TESTER");
    let tester = system.performLogin("newUser@test.com", "TESTER") as number

    system.addDiscount(originOwner, shopID, 0.5)
    system.addPurchasePolicy(originOwner, shopID, ConditionType.NotCategory, "GTX")

    system.addItemToBasket(tester, ProductImpl._product_id_specifier - 1, shopID, 2)
    system.purchaseCart(tester, "something")
    system.addItemToBasket(tester, ProductImpl._product_id_specifier - 2, shopID, 1)


    const shops = system.shops
    const users = system.login.existing_users
    const notifications = PublisherImpl.getInstance().notificationQueue
    const purchases = UserPurchaseHistoryImpl.getInstance().history

    it("Check shops are restored", async () => {
        await SystemImpl.rollback().then(_ => {
            expect(shopsAreEquals(shops, SystemImpl.getInstance().shops)).to.be.true
        })
    })
    it("Check users are restored", async () => {
        await SystemImpl.rollback().then(_ => {
            expect(usersAreRestored(users, SystemImpl.getInstance().login.existing_users)).to.be.true
        })
    })
    it("Check users are restored", async () => {
        await SystemImpl.rollback().then(_ => {
            expect(usersAreRestored(users, SystemImpl.getInstance().login.existing_users)).to.be.true
        })
    })
    it("Check notifications are restored", async () => {
        await SystemImpl.rollback().then(_ => {
            expect(notificationsAreRestored(notifications, PublisherImpl.getInstance().notificationQueue)).to.be.true
        })
    })
    it("Check purchases are restored", async () => {
        await SystemImpl.rollback().then(_ => {
            expect(purchasesAreRestored(purchases, UserPurchaseHistoryImpl.getInstance().history)).to.be.true
        })
    })
})