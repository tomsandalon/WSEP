import {app,
} from "../../../Server";
const expect = require('chai').expect;
import {chai, client, cookie_prefix, NotificationTest} from "../Setup";
import {beforeEach} from "mocha";
import {
    localhost,
    OK, options, port,
    Unauthorized
} from "../../../Config/Config";
import {route_login, route_notifications, route_purchase, route_register} from "../../../Routes";
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
    after(() => {
    })
    it('Purchase successful - Notification for owner', (done) =>{
        client.post(route_purchase)
            .set('Cookie', cookie_prefix + NotificationTest.user_two_sess_id)
            .send({
                shop_id: NotificationTest.shop_id,
                payment: 'Banana'
            })
            .expect(OK)
            .end(() =>{
                // @ts-ignore
                NotificationTest.user_one_socket.on(get_notifications, (data: any) => {
                    expect(JSON.parse(data).length).greaterThan(0)
                    done()
                })
            })
    })
});