import {expect} from "chai";
import {NotificationPool} from "../../../../Logic/Domain/Notifications/NotificationPool";
import {NotificationPoolImpl} from "../../../../Logic/Domain/Notifications/NotificationPoolImpl";
import {Notification} from "../../../../Logic/Domain/Notifications/Notification";
describe('Notification Pool testsuite', () => {
    describe('Single element', () => {
        const user_id = 1;
        const notification = new Notification('Do your work');
        const pool: NotificationPoolImpl = NotificationPoolImpl.getInstance();
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
        const pool: NotificationPoolImpl = NotificationPoolImpl.getInstance();
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