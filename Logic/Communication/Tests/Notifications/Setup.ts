import {app, server} from "../../Server";
import {
    localhost,
    OK, sid
} from "../../Config/Config";
import {afterEach, before, beforeEach} from "mocha";
import {SessionTest} from "../Setup";
import {
    route_cart,
    route_guest,
    route_login,
    route_register,
    route_shop,
    route_shop_manage_product
} from "../../Routes";
import {acknowledge_for_notifications, get_notifications, hello, send_notifications} from "../../WSEvents";
import lookup from "socket.io-client";
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
    public static user_one_socket = undefined
    public static user_two_socket = undefined
    public static user_three_sess_id = '';
    public static user_three_socket = undefined
}

export const mainUser = "TomAndSons@gmail.com";
export const mainUser_pass = "123456";
export const secondUser = "liorpev@gmail.com";
export const secondUser_pass = "123456";
export const thirdUser = "Sossana@gmail.com";
export const thirdUser_pass = "123456";
export const product = {
    id: 0,
    amount: 100,
};
const io = require('socket.io-client');
const openWSConnection = (sess_id: string): any => {
    const cookie = 'SID=' + sess_id;
    let socket = io(localhost, { rejectUnauthorized: false });
    socket.on(acknowledge_for_notifications, (data: any) => {
        socket.emit(send_notifications, cookie)
    })
    socket.emit(hello, cookie);
    return socket;
}
export const setupUsers = async () =>{
//* DELETE GUEST INIT
    let res = await client.get(route_guest)
    expect(res.status).equal(OK)
    NotificationTest.user_one_sess_id = res.headers['set-cookie'].find((cookie: any) => cookie.startsWith(sid))
        .split(';')[0]
        .split('=')[1];
    NotificationTest.user_one_socket = openWSConnection(NotificationTest.user_one_sess_id);
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
        })
    expect(res.status).equal(OK)
    res = await client.get(route_guest)
    expect(res.status).equal(OK)
    NotificationTest.user_two_sess_id = res.headers['set-cookie'].find((cookie: any) => cookie.startsWith(sid))
        .split(';')[0]
        .split('=')[1];
    NotificationTest.user_two_socket = openWSConnection(NotificationTest.user_two_sess_id);
    res = await client.post(route_register)
                .set('Cookie', cookie_prefix + NotificationTest.user_two_sess_id)
                .send({
                    email: secondUser,
                    password: secondUser_pass
                })
    expect(res.status).equal(OK)
    res = await client.post(route_login)
                .set('Cookie', cookie_prefix + NotificationTest.user_two_sess_id)
                .send({
                    email: secondUser,
                    password: secondUser_pass
                })
    expect(res.status).equal(OK)
    res = await client.get(route_guest)
    expect(res.status).equal(OK)
    NotificationTest.user_three_sess_id = res.headers['set-cookie'].find((cookie: any) => cookie.startsWith(sid))
        .split(';')[0]
        .split('=')[1];
    NotificationTest.user_three_socket = openWSConnection(NotificationTest.user_three_sess_id);
    res = await client.post(route_register)
        .set('Cookie', cookie_prefix + NotificationTest.user_three_sess_id)
        .send({
            email: thirdUser,
            password: thirdUser_pass
        })
    expect(res.status).equal(OK)
    res = await client.post(route_login)
        .set('Cookie', cookie_prefix + NotificationTest.user_three_sess_id)
        .send({
            email: thirdUser,
            password: thirdUser_pass
        })
    expect(res.status).equal(OK)
}

//* DELETE GUEST INIT
export const cleanUsers = async () => {
    if (NotificationTest.user_one_socket != undefined){
        // @ts-ignore
        await NotificationTest.user_one_socket.close();
    }
    if (NotificationTest.user_two_socket != undefined){
        // @ts-ignore
        await NotificationTest.user_two_socket.close();
    }
    if (NotificationTest.user_three_sess_id != undefined){
        // @ts-ignore
        await NotificationTest.user_three_socket.close();
    }
}
//* DELETE GUEST INIT