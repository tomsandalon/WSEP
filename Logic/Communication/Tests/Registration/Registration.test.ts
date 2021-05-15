import {app} from "../../Server";
const expect = require('chai').expect;
import {chai, cookie_prefix, SessionTest} from "../Setup";
import {beforeEach} from "mocha";
import {BadRequest, OK, Unauthorized} from "../../Config/Config";
import {route_register} from "../../Routes";
const request = require('supertest');

describe('Registration tests', () => {
    beforeEach(() =>{
        expect(SessionTest.sess_id).not.equal('')
    })
    it('Registration unsuccessful - bad email - no @',  (done) =>{
        request(app).post(route_register)
            .set('Cookie', cookie_prefix + SessionTest.sess_id)
            .send({
                email: "Nethanelgmail.com",
                password: "123456"
            })
            .expect(BadRequest, done);
    })
    it('Registration unsuccessful - bad email - no dot',  (done) =>{
        request(app).post(route_register)
            .set('Cookie', cookie_prefix + SessionTest.sess_id)
            .send({
                email: "Nethanel@gmailcom",
                password: "123456"
            })
            .expect(BadRequest, done);
    })
    it('Registration unsuccessful - email empty',  (done) =>{
        request(app).post(route_register)
            .set('Cookie', cookie_prefix + SessionTest.sess_id)
            .send({
                email: "",
                password: "123456"
            })
            .expect(BadRequest, done);
    })
    it('Registration unsuccessful - password empty',  (done) =>{//TODO TOM resolve this
        request(app).post(route_register)
            .set('Cookie', cookie_prefix + SessionTest.sess_id)
            .send({
                email: "Nethanel@gmail.com",
                password: ""
            })
            .expect(BadRequest, done);
    })
    it('Registration successful',  (done) =>{
        request(app).post(route_register)
            .set('Cookie', cookie_prefix + SessionTest.sess_id)
            .send({
                email: "Nethanel@gmail.com",
                password: "123456"
            })
            .expect(OK, done);
    })
    it('Register and register again',  (done) =>{
        request(app).post(route_register)
            .set('Cookie', cookie_prefix + SessionTest.sess_id)
            .send({
                email: "Menni@gmail.com",
                password: "123456"
            })
            .expect(OK, done);
        request(app).post(route_register)
            .set('Cookie', cookie_prefix + SessionTest.sess_id)
            .send({
                email: "Menni@gmail.com",
                password: "123456"
            })
            .expect(BadRequest, done);
    })
})