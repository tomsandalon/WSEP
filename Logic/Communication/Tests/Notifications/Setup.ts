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

const fs = require('fs')
const https = require('https');
const request = require('supertest');
const requestWS = require('superwstest');
export const chai = require('chai');
const expect = require('chai').expect;
const chaiNock = require('chai-nock');
chai.use(chaiNock);
export const cookie_prefix = 'SID=';

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
before((done) =>{
//* DELETE GUEST INIT
    request(app).get(route_guest)
        .expect(OK)
        .then((res: any) =>{
            NotificationTest.user_one_sess_id = res.headers['set-cookie'].find((cookie: any) => cookie.startsWith(sid))
                .split(';')[0]
                .split('=')[1];
            console.log(NotificationTest.user_one_sess_id)
            done();
        })
        .catch((err: any) => done(err));
    request(app).post(route_register)
        .set('Cookie', cookie_prefix + NotificationTest.user_one_sess_id)
        .send({
            email: mainUser,
            password: mainUser_pass
        })
        .expect(OK);
    request(app).post(route_login)
        .set('Cookie', cookie_prefix + NotificationTest.user_one_sess_id)
        .send({
            email: mainUser,
            password: mainUser_pass
        })
        .expect(OK);
//* DELETE GUEST INIT
    request(app).post(route_shop)
        .set('Cookie', cookie_prefix + NotificationTest.user_one_sess_id)
        .send({
            name: "NIVIDIA",
            description: "BEST GPU 4 Ever",
            location: "Taiwan",
            bank_info: "Taiwan 4 ever"
        })
        .expect(OK)
        .then((res: any) =>{
             NotificationTest.shop_id = res.headers['set-cookie'].find((cookie: any) => cookie.startsWith(sid))
                .split(';')[0]
                .split('=')[1];
            done();
        })
        .catch((err: any) => done(err));
    request(app).post(route_shop_manage_product)
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
        .expect(OK);
    request(app).get(route_guest)
        .expect(OK)
        .then((res: any) =>{
            NotificationTest.user_two_sess_id = res.headers['set-cookie'].find((cookie: any) => cookie.startsWith(sid))
                .split(';')[0]
                .split('=')[1];
            console.log(NotificationTest.user_two_sess_id)
            done();
        })
        .catch((err: any) => done(err));
    request(app).post(route_register)
        .set('Cookie', cookie_prefix + NotificationTest.user_two_sess_id)
        .send({
            email: secondUser,
            password: secondUser_pass
        })
        .expect(OK);
    request(app).post(route_login)
        .set('Cookie', cookie_prefix + NotificationTest.user_two_sess_id)
        .send({
            email: secondUser,
            password: secondUser_pass
        })
        .expect(OK);
    request(app).post(route_cart)
        .set('Cookie', cookie_prefix + NotificationTest.user_two_sess_id)
        .send({
            shop_id: NotificationTest.shop_id,
            product_id: product.id,
            amount: product.amount / 10
        })
        .expect(OK, done);
})

//* DELETE GUEST INIT
after((done) => {
    server.close();
    done();
})
//* DELETE GUEST INIT