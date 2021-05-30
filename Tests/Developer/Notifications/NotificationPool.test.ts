import {expect} from "chai";
import {Publisher} from "../../../Logic/Domain/Notifications/Publisher";
import {PublisherImpl} from "../../../Logic/Domain/Notifications/PublisherImpl";
import {Notification} from "../../../Logic/Domain/Notifications/Notification";
import {Shop, ShopImpl} from "../../../Logic/Domain/Shop/Shop";
import {id_counter, User, UserImpl} from "../../../Logic/Domain/Users/User";
import {pool} from "async-parallel";
import {ShopInventory} from "../../../Logic/Domain/Shop/ShopInventory";
import {RegisterImpl} from "../../../Logic/Domain/Users/Register";
import {LoginImpl} from "../../../Logic/Domain/Users/Login";
import {SystemImpl} from "../../../Logic/Domain/System";
describe('Notification Pool testsuite', () => {
    describe('Single element', () => {
        const user_id = 1;
        const notification = new Notification('Do your work');
        const pool: PublisherImpl = PublisherImpl.getInstance(true);
        it('Add notification', () => {
            expect(pool.getNotifications(user_id).length).equal(0)
            pool.notify(1, notification);
            const sideEffect = pool.getNotifications(user_id);
            expect(sideEffect.length).to.equal(1);
            expect(sideEffect[0]).to.equal(notification);
        });
        it('Remove notifications', () => {
            const content = pool.getNotifications(user_id);
            expect(content.length).to.equal(1);
            expect(content[0]).to.equal(notification);
            pool.removeNotifications(user_id)
            expect(pool.getNotifications(user_id).length).to.equal(0)
        });
    });
    describe('Many elements', () => {
        const user_id = 1;
        const notification = new Notification('Do your work');
        const notification2 = new Notification('Back to work');
        const notification3 = new Notification('Love your work');
        const collection = [notification, notification2, notification3];
        const pool: PublisherImpl = PublisherImpl.getInstance(true);
        it('Add notifications', () => {
            expect(pool.getNotifications(user_id).length).equal(0)
            pool.notify(1, notification);
            pool.notify(1, notification2);
            pool.notify(1, notification3);
            const sideEffect = pool.getNotifications(user_id);
            expect(sideEffect.length).to.equal(3);
            expect(sideEffect).to.deep.equal(collection);
        });
        it('Remove notifications', () => {
            const content = pool.getNotifications(user_id);
            expect(content.length).to.equal(3);
            expect(content).to.deep.equal(collection);
            pool.removeNotifications(user_id)
            expect(pool.getNotifications(user_id).length).to.equal(0)
        });
    });
});

describe('Domain notifications tests', () => {
    const getNewItem = (shop: ShopInventory): number => shop.products.reduce((acc, product) => Math.max(product.product_id, acc), -1);
    // SystemImpl.getInstance(true)
    it('Purchase', () => {
        const pool: PublisherImpl = PublisherImpl.getInstance(true);
        pool.removeAllNotificationsForTests()
        const shop: ShopImpl = new ShopImpl("Tom@gmail.com", "12345-TOM-SAND", "Best local shop in the negev", "Negev", "Tom and sons");
        const user: User = new UserImpl();
        shop.addItem("Tom@gmail.com", "GTX", "GPU", 1000, ["GPU", "HW"], 1000);
        user.addToBasket(shop.inventory, getNewItem(shop.inventory), 2);
        user.purchaseBasket(shop.shop_id, "1234-Israel-Israeli")
            .then(_ => expect(pool.getNotifications(user.user_id).length).to.be.eq(1))
    })

    it('Demotion', () => {
        const pool: PublisherImpl = PublisherImpl.getInstance(true);
        const shop: Shop = new ShopImpl("tomsand123@post.bgu.ac.il", "496351", "best shop in town", "town", "shopie")
        RegisterImpl.getInstance().register("tomsand123@post.bgu.ac.il","123456");
        RegisterImpl.getInstance().register("owner1123@bgu.ac.il","123456");
        RegisterImpl.getInstance().register("owner2123@bgu.ac.il","123456");
        RegisterImpl.getInstance().register("owner3123@bgu.ac.il","123456");
        RegisterImpl.getInstance().register("manager1123@bgu.ac.il","123456");
        LoginImpl.getInstance().login("tomsand123@post.bgu.ac.il","123456");
        LoginImpl.getInstance().login("owner1123@bgu.ac.il","123456");
        LoginImpl.getInstance().login("owner2123@bgu.ac.il","123456");
        LoginImpl.getInstance().login("owner3123@bgu.ac.il","123456");
        LoginImpl.getInstance().login("manager1123@bgu.ac.il","123456");
        shop.appointNewOwner("tomsand123@post.bgu.ac.il", "owner1123@bgu.ac.il")
        shop.appointNewOwner("owner1123@bgu.ac.il", "owner2123@bgu.ac.il")
        shop.appointNewOwner("owner1123@bgu.ac.il", "owner3123@bgu.ac.il")
        shop.appointNewManager("owner3123@bgu.ac.il", "manager1123@bgu.ac.il")
        shop.removeOwner("tomsand123@post.bgu.ac.il", "owner1123@bgu.ac.il")
        console.log("this: " + JSON.stringify(pool.notificationQueue))
        expect(pool.getNotifications(id_counter - 5).length == 0).to.be.true
        expect(pool.getNotifications(id_counter - 4).length == 1).to.be.true
        expect(pool.getNotifications(id_counter - 3).length == 1).to.be.true
        expect(pool.getNotifications(id_counter - 2).length == 1).to.be.true
        expect(pool.getNotifications(id_counter - 1).length == 1).to.be.true
    });
});