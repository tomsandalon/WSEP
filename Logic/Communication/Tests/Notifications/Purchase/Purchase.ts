import {app,
} from "../../../Server";
const expect = require('chai').expect;
import {chai, client, cookie_prefix, NotificationTest} from "../Setup";
import {beforeEach} from "mocha";
import {
    localhost,
    OK, options, port,
    route_login,
    route_notifications,
    route_purchase,
    route_register,
    Unauthorized
} from "../../../Config/Config";
const async = require('async');
const request = require('supertest');
const fs = require('fs');
describe('Purchase Notifications Tests', function () {
    let socket: any = undefined;
    beforeEach(() =>{
        expect(NotificationTest.user_one_sess_id).not.equal('')
        expect(NotificationTest.user_two_sess_id).not.equal('')
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
        if (socket !== undefined){
            console.log('Closing')
            socket.close();
        }
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
                const io = require('socket.io-client');
                socket = io(localhost, { rejectUnauthorized: false });
                socket.on('Message', (data: any) => {
                    console.log('Successful')
                    done()
                })
            })
    })
});