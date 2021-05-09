import {app} from "../../../Server";
const expect = require('chai').expect;
import {cookie_prefix, SessionTest} from "../../Setup";
import {before, beforeEach} from "mocha";
import {
    BadRequest,
    OK, route_guest, route_login, route_register,
    route_shop_management, sid,
} from "../../../Config/Config";
const request = require('supertest');

describe('Add Manager to Shop tests', () => {
    before((done => {
        request(app).post(route_register)
            .set('Cookie', cookie_prefix + SessionTest.sess_id)
            .send({
                email: "TomerNagar@gmail.com",
                password: "123456"
            })
            .expect(400, done);

        request(app).get(route_guest)
            .expect(200)
            .then((res: any) =>{
                SessionTest.sess_id = res.headers['set-cookie'].find((cookie: any) => cookie.startsWith(sid))
                    .split(';')[0]
                    .split('=')[1];
                console.log(SessionTest.sess_id)
                done();
            })
            .catch((err: any) => done(err));

        request(app).post(route_login)
            .set('Cookie', cookie_prefix + SessionTest.sess_id)
            .send({
                email: "TomAndSons@gmail.com",
                password: "123456"
            })
            .expect(OK, done);
    }))
    beforeEach(() =>{
        expect(SessionTest.sess_id).not.equal('')
    })
    it('Add Manager unsuccessfully - no name',  (done) =>{
        request(app).post(route_shop_management)
            .set('Cookie', cookie_prefix + SessionTest.sess_id)
            .send({
                shop_id: 1,
                appointee_user_email: ""
            })
            .expect(BadRequest, done);
    })
    it('Add Product unsuccessfully - no description',  (done) =>{
        request(app).post(route_shop_management)
            .set('Cookie', cookie_prefix + SessionTest.sess_id)
            .send({
                shop_id: 1,
                name: "GTX 1060",
                description: "",
                amount: 50,
                categories: ["GPU"],
                base_price: 1000,
                purchase_type: 0
            })
            .expect(BadRequest, done);
    })
    it('Add Product unsuccessfully - amount negative',  (done) =>{
        request(app).post(route_shop_management)
            .set('Cookie', cookie_prefix + SessionTest.sess_id)
            .send({
                shop_id: 1,
                name: "GTX 1060",
                description: "6GB RAM",
                amount: -1,
                categories: ["GPU"],
                base_price: 1000,
                purchase_type: 0
            })
            .expect(BadRequest, done);
    })
    it('Add Product unsuccessfully - amount 0',  (done) =>{
        request(app).post(route_shop_management)
            .set('Cookie', cookie_prefix + SessionTest.sess_id)
            .send({
                shop_id: 1,
                name: "GTX 1060",
                description: "6GB RAM",
                amount: 0,
                categories: ["GPU"],
                base_price: 1000,
                purchase_type: 0
            })
            .expect(BadRequest, done);
    })
    it('Add Product unsuccessfully - negative base price',  (done) =>{
        request(app).post(route_shop_management)
            .set('Cookie', cookie_prefix + SessionTest.sess_id)
            .send({
                shop_id: 1,
                name: "GTX 1060",
                description: "6GB RAM",
                amount: 50,
                categories: ["GPU"],
                base_price: -1,
                purchase_type: 0
            })
            .expect(BadRequest, done);
    })
    it('Add Product unsuccessfully - base price 0',  (done) =>{
        request(app).post(route_shop_management)
            .set('Cookie', cookie_prefix + SessionTest.sess_id)
            .send({
                shop_id: 1,
                name: "GTX 1060",
                description: "6GB RAM",
                amount: 50,
                categories: ["GPU"],
                base_price: 0,
                purchase_type: 0
            })
            .expect(BadRequest, done);
    })
    it('Add Product unsuccessfully - bad purchase type',  (done) =>{
        request(app).post(route_shop_management)
            .set('Cookie', cookie_prefix + SessionTest.sess_id)
            .send({
                shop_id: 1,
                name: "GTX 1060",
                description: "6GB RAM",
                amount: 50,
                categories: ["GPU"],
                base_price: 1000,
                purchase_type: 111
            })
            .expect(BadRequest, done);
    })
    it('Add Product successfully',  (done) =>{
        request(app).post(route_shop_management)
            .set('Cookie', cookie_prefix + SessionTest.sess_id)
            .send({
                shop_id: 1,
                name: "GTX 1060",
                description: "6GB RAM",
                amount: 50,
                categories: ["GPU"],
                base_price: 1000,
                purchase_type: 0
            })
            .expect(OK, done);
    })
})