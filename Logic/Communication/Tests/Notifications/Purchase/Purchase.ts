import {app} from "../../../Server";
const expect = require('chai').expect;
import {chai, client, cookie_prefix, NotificationTest} from "../Setup";
import {beforeEach} from "mocha";
import {
    localhost,
    OK, port,
    route_login,
    route_notifications,
    route_purchase,
    route_register,
    Unauthorized
} from "../../../Config/Config";
const async = require('async');
const request = require('supertest');
import requestWS from 'superwstest';
describe('Purchase Notifications Tests', function () {
    beforeEach(() =>{
        expect(NotificationTest.user_one_sess_id).not.equal('')
        expect(NotificationTest.user_two_sess_id).not.equal('')
    })
    it('Purchase successful - Notification for owner', async () =>{
        let res = await client.post(route_purchase)
            .set('Cookie', cookie_prefix + NotificationTest.user_two_sess_id)
            .send({
                shop_id: NotificationTest.shop_id,
                payment: 'Banana'
            })
        expect(res.status).equal(OK)
        requestWS(localhost + route_notifications ).ws(route_notifications)
            .expectText('hello')
            .sendText('foo')
            .expectText('echo foo')
    })
});