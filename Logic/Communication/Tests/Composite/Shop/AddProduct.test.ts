import {app} from "../../../Server";
const expect = require('chai').expect;
import {chai, cookie_prefix, SessionTest} from "../../Setup";
import {beforeEach} from "mocha";
import {BadRequest, OK, route_login, route_logout, route_register} from "../../../Config/Config";
import {Purchase_Type} from "../../../../Domain/Shop/ShopInventory";
const request = require('supertest');

describe('Add Product to Shop tests', () => {
    beforeEach(() =>{
        expect(SessionTest.sess_id).not.equal('')
    })
    it('Add Product unsuccessfully - no name',  (done) =>{
        request(app).post(route_register)
            .set('Cookie', cookie_prefix + SessionTest.sess_id)
            .send({
                shop_id: 1,
                name: "",
                description: "6GB RAM",
                amount: 50,
                categories: ["GPU"],
                base_price: 1000,
                purchase_type: 0
            })
            .expect(BadRequest, done);
    })
    it('Add Product unsuccessfully - no description',  (done) =>{
        request(app).post(route_register)
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
        request(app).post(route_register)
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
        request(app).post(route_register)
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
        request(app).post(route_register)
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
        request(app).post(route_register)
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
        request(app).post(route_register)
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
        request(app).post(route_register)
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