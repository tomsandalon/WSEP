import {cleanUsers, client, cookie_prefix, NotificationTest, secondUser, setupUsers, thirdUser} from "../Setup";
import {beforeEach} from "mocha";
import {OK} from "../../../../../../Logic/Communication/Config/Config";
import {
    route_shop_ownership_assign_manager,
    route_shop_ownership_assign_owner
} from "../../../../../../Logic/Communication/Routes";
import {get_notifications} from "../../../../../../Logic/Communication/WSEvents";

const expect = require('chai').expect;
const async = require('async');
const request = require('supertest');
const fs = require('fs');
describe('Fire Appointee Communications', function () {
    beforeEach(() => {
        expect(NotificationTest.user_one_sess_id).not.equal('')
        expect(NotificationTest.user_two_sess_id).not.equal('')
        expect(NotificationTest.user_one_socket).not.equal(undefined)
        expect(NotificationTest.user_two_socket).not.equal(undefined)
    })
    before(async () => {
        await setupUsers()
    })

    after(() => {
        cleanUsers()
    })

    const test_1 = async () => {
        let res = await client.post(route_shop_ownership_assign_owner)
            .set('Cookie', cookie_prefix + NotificationTest.user_one_sess_id)
            .send({
                shop_id: NotificationTest.shop_id,
                email: secondUser
            })
        expect(res.status).equal(OK)
        res = await client.post(route_shop_ownership_assign_manager)
            .set('Cookie', cookie_prefix + NotificationTest.user_two_sess_id)
            .send({
                shop_id: NotificationTest.shop_id,
                email: thirdUser
            })
        expect(res.status).equal(OK)
    }
    it('Fire successful - Notification for User 2 Owner and 3 manager', (done) =>{
        test_1()
        client.delete(route_shop_ownership_assign_owner)
            .set('Cookie', cookie_prefix + NotificationTest.user_one_sess_id)
            .send({
                shop_id: NotificationTest.shop_id,
                target: secondUser
            })
            .expect(OK)
            .end(() => {
            })
        // @ts-ignore
        NotificationTest.user_two_socket.on(get_notifications, async (data: any) => {
            expect(JSON.parse(data).length).greaterThan(0)
        })
        // @ts-ignore
        NotificationTest.user_three_socket.on(get_notifications, (data: any) => {
            expect(JSON.parse(data).length).greaterThan(0)
        })
        done()
    })

    const test_2 = async () => {
        let res = await client.post(route_shop_ownership_assign_manager)
            .set('Cookie', cookie_prefix + NotificationTest.user_one_sess_id)
            .send({
                shop_id: NotificationTest.shop_id,
                email: secondUser
            })
        expect(res.status).equal(OK)
        res = await client.post(route_shop_ownership_assign_manager)
            .set('Cookie', cookie_prefix + NotificationTest.user_two_sess_id)
            .send({
                shop_id: NotificationTest.shop_id,
                email: thirdUser
            })
        expect(res.status).equal(OK)
    }
    it('Fire successful - Notification for User 2 manager and 3 manager', (done) =>{
        test_2()
        client.delete(route_shop_ownership_assign_manager)
            .set('Cookie', cookie_prefix + NotificationTest.user_one_sess_id)
            .send({
                shop_id: NotificationTest.shop_id,
                target: secondUser
            })
            .expect(OK)
            .end(() => {
            })
        // @ts-ignore
        NotificationTest.user_two_socket.on(get_notifications, async (data: any) => {
            expect(JSON.parse(data).length).greaterThan(0)
        })
        // @ts-ignore
        NotificationTest.user_three_socket.on(get_notifications, (data: any) => {
            expect(JSON.parse(data).length).greaterThan(0)
        })
        done()
    })
});