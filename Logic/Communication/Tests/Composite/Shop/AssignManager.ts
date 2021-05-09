import {app} from "../../../Server";
const expect = require('chai').expect;
import {cookie_prefix, SessionTest} from "../../Setup";
import {before, beforeEach} from "mocha";
import {
    BadRequest,
    OK, route_guest, route_login, route_register, route_shop,
    route_shop_management, sid,
} from "../../../Config/Config";
const request = require('supertest');

describe('Add Manager to Shop tests', () => {
    let second_user_sid = '';
    let my_shop = '';
    const tomer = "TomerNagar@gmail.com";
    const tomer_pass = '123456';
    before((done => {
        request(app).get(route_guest)
            .expect(200)
            .then((res: any) =>{
                second_user_sid = res.headers['set-cookie'].find((cookie: any) => cookie.startsWith(sid))
                    .split(';')[0]
                    .split('=')[1];
                done();
            })
            .catch((err: any) => done(err));
        request(app).post(route_register)
            .set('Cookie', cookie_prefix + second_user_sid)
            .send({
                email: tomer,
                password: tomer_pass
            })
            .expect(200, done);
        request(app).post(route_login)
            .set('Cookie', cookie_prefix + second_user_sid)
            .send({
                email: tomer,
                password: tomer_pass
            })
            .expect(OK, done);
        request(app).post(route_shop)
            .set('Cookie', cookie_prefix + SessionTest.sess_id)
            .send({
                name: "ZARA",
                description: "Best style in UK",
                location: 'China',
                bank_info: "Buddha 4 ever"
            })
            .expect(OK, done)
            .then((res: any) => res.text())
            .then((data: any) => {
                my_shop = data;
                done(done)
            });
    }))
    beforeEach(() =>{
        expect(SessionTest.sess_id).not.equal('')
        expect(second_user_sid).not.equal('')
        expect(my_shop).not.equal('')
    })
    it('Add Manager unsuccessfully - no name',  (done) =>{
        request(app).post(route_shop_management)
            .set('Cookie', cookie_prefix + SessionTest.sess_id)
            .send({
                shop_id: my_shop,
                appointee_user_email: ""
            })
            .expect(BadRequest, done);
    })
    it('Add Manager unsuccessfully - bad shop id',  (done) =>{
        request(app).post(route_shop_management)
            .set('Cookie', cookie_prefix + SessionTest.sess_id)
            .send({
                shop_id: -69696,
                appointee_user_email: tomer
            })
            .expect(BadRequest, done);
    })
    it('Add Manager unsuccessfully - unknown user in the system ',  (done) =>{
        request(app).post(route_shop_management)
            .set('Cookie', cookie_prefix + SessionTest.sess_id)
            .send({
                shop_id: my_shop,
                appointee_user_email: "DemonSlayer@blizzard.com"
            })
            .expect(BadRequest, done);
    })
    it('Add Manager successfully',  (done) =>{
        request(app).post(route_shop_management)
            .set('Cookie', cookie_prefix + SessionTest.sess_id)
            .send({
                shop_id: my_shop,
                appointee_user_email: tomer
            })
            .expect(BadRequest, done);
    })
})
