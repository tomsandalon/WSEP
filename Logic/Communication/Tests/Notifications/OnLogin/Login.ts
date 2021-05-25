import {app,
} from "../../../Server";
const expect = require('chai').expect;
import {
    chai,
    cleanUsers,
    client,
    cookie_prefix,
    mainUser,
    mainUser_pass,
    NotificationTest,
    product,
    setupUsers
} from "../Setup";
import {beforeEach} from "mocha";
import {
    localhost,
    OK, options, port,
    Unauthorized
} from "../../../Config/Config";
import {
    route_cart,
    route_login,
    route_logout,
    route_notifications,
    route_purchase,
    route_register
} from "../../../Routes";
import {acknowledge_for_notifications, get_notifications} from "../../../WSEvents";
const async = require('async');
const request = require('supertest');
const fs = require('fs');
describe('Purchase Notifications Tests', function () {
    beforeEach(() =>{
        expect(NotificationTest.user_one_sess_id).not.equal('')
        expect(NotificationTest.user_two_sess_id).not.equal('')
        expect(NotificationTest.user_one_socket).not.equal(undefined)
        expect(NotificationTest.user_two_socket).not.equal(undefined)
        // const socket = io.connect('https://localhost:8000/',
        //         {
        //         'reconnection delay' : 0
        //         , 'reopen delay' : 0
        //         , 'force new connection' : true
        //     }
        // );
        // socket.on('connect', function() {
        //     console.log('worked...');
        //     done()
        // });
        // socket.on('disconnect', function() {
        //     console.log('disconnected...');
        // })
    })
    before(async () => {
        await setupUsers();
        let res = await client.post(route_cart)
            .set('Cookie', cookie_prefix + NotificationTest.user_two_sess_id)
            .send({
                shop_id: NotificationTest.shop_id,
                product_id: product.id,
                amount: product.amount / 10
            })
        expect(res.status).equal(OK)
        await client.post(route_logout)
            .set('Cookie', cookie_prefix + NotificationTest.user_one_sess_id)
        expect(res.status, res.text).equal(OK)
    })

    after( () => {
        cleanUsers();
    })
    it('Purchase successful - Notification for owner', (done) =>{
        let isLogin = false;
        client.post(route_purchase)
            .set('Cookie', cookie_prefix + NotificationTest.user_two_sess_id)
            .send({
                shop_id: NotificationTest.shop_id,
                payment: 'Banana'
            })
            .expect(OK)
            .then(() =>{
                client.post(route_login)
                    .set('Cookie', cookie_prefix + NotificationTest.user_one_sess_id)
                    .send({
                        email: mainUser,
                        password: mainUser_pass
                    })
                    .expect(OK)
                    .then(() =>{
                        isLogin = true;
                    })
            })
        // @ts-ignore
        NotificationTest.user_one_socket.on(get_notifications, (data: any) => {
            if(isLogin){
                expect(JSON.parse(data).length).greaterThan(0)
            } else {
                done('Should not get notification')
            }
            done()
        })
    })
});