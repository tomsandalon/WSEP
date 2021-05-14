import {app, server} from "../../Server";
import {
    OK, route_cart,
    route_guest,
    route_login,
    route_register,
    route_shop,
    route_shop_manage_product,
    sid
} from "../../Config/Config";
import {afterEach, before, beforeEach} from "mocha";
import {SessionTest} from "../Setup";
const async = require('async')
const fs = require('fs')
const https = require('https');
const request = require('supertest');
const requestWS = require('superwstest');
export const chai = require('chai');
const expect = require('chai').expect;
const assert = require('chai').assert;
const chaiNock = require('chai-nock');
chai.use(chaiNock);
export const cookie_prefix = 'SID=';

export const client = request(app);
export class NotificationTest {
    public static user_one_sess_id = '';
    public static user_two_sess_id = '';
    public static shop_id = '';
    }

export const mainUser = "TomAndSons@gmail.com";
export const mainUser_pass = "123456";
export const secondUser = "liorpev@gmail.com";
export const secondUser_pass = "123456";
export const product = {
    id: 0,
    amount: 100,
};
before(async () =>{
//* DELETE GUEST INIT
    let res = await client.get(route_guest)
    expect(res.status).equal(OK)
    NotificationTest.user_one_sess_id = res.headers['set-cookie'].find((cookie: any) => cookie.startsWith(sid))
        .split(';')[0]
        .split('=')[1];
    res = await client.post(route_register)
        .set('Cookie', cookie_prefix + NotificationTest.user_one_sess_id)
        .send({
            email: mainUser,
            password: mainUser_pass
        })
    expect(res.status, res.text).equal(OK)
    res = await client.post(route_login)
        .set('Cookie', cookie_prefix + NotificationTest.user_one_sess_id)
        .send({
            email: mainUser,
            password: mainUser_pass
        })
    expect(res.status, res.text).equal(OK)
    res = await client.post(route_shop)
        .set('Cookie', cookie_prefix + NotificationTest.user_one_sess_id)
        .send({
            name: "NIVIDIA",
            description: "BEST GPU 4 Ever",
            location: "Taiwan",
            bank_info: "Taiwan 4 ever"
        })
    expect(res.status).equal(OK)
    NotificationTest.shop_id = res.text
    res = await client.post(route_shop_manage_product)
        .set('Cookie', cookie_prefix + NotificationTest.user_one_sess_id)
        .send({
            shop_id: NotificationTest.shop_id,
            name: "GTX 1060",
            description: "6GB RAM",
            amount: product.amount,
            categories: ["GPU"],
            base_price: 1000,
            purchase_type: 0
        })
    expect(res.status).equal(OK)
    res = await client.get(route_guest)
    expect(res.status).equal(OK)
    NotificationTest.user_two_sess_id = res.headers['set-cookie'].find((cookie: any) => cookie.startsWith(sid))
        .split(';')[0]
        .split('=')[1];
    console.log(`User 2 ==${NotificationTest.user_two_sess_id}`)
    /*
            client.post(route_register)
                .set('Cookie', cookie_prefix + NotificationTest.user_two_sess_id)
                .send({
                    email: secondUser,
                    password: secondUser_pass
                })
                .expect(OK)
            client.post(route_login)
                .set('Cookie', cookie_prefix + NotificationTest.user_two_sess_id)
                .send({
                    email: secondUser,
                    password: secondUser_pass
                })
                .expect(OK)
            next()
        },
        (next: any) => {
            client.post(route_cart)
                .set('Cookie', cookie_prefix + NotificationTest.user_two_sess_id)
                .send({
                    shop_id: NotificationTest.shop_id,
                    product_id: product.id,
                    amount: product.amount / 10
                })
                .expect(OK)
            next()
        },
    ])*/
})

//* DELETE GUEST INIT
after((done) => {
    server.close();
    done();
})
//* DELETE GUEST INIT