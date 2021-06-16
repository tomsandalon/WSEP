import {app} from "../../../../../Logic/Communication/Server";
import {cookie_prefix, SessionTest} from "../Setup";
import {beforeEach} from "mocha";
import {OK, Unauthorized} from "../../../../../Logic/Communication/Config/Config";
import {route_login, route_register} from "../../../../../Logic/Communication/Routes";

const expect = require('chai').expect;
const request = require('supertest');
describe('Login Communications', function () {
    before(function (done) {
        request(app).post(route_register)
            .set('Cookie', cookie_prefix + SessionTest.sess_id)
            .send({
                email: "Tomer@gmail.com",
                password: "123456"
            })
            .expect(OK, done);
    });
    beforeEach(() => {
        expect(SessionTest.sess_id).not.equal('')
    })
    it('Login successful',  (done) =>{
        request(app).post(route_login)
            .set('Cookie', cookie_prefix + SessionTest.sess_id)
            .send({
                email: "Tomer@gmail.com",
                password: "123456"
            })
            .expect(OK, done);
    })
    it('Login unsuccessful - Bad password',  (done) =>{
        request(app).post(route_login)
            .set('Cookie', cookie_prefix + SessionTest.sess_id)
            .send({
                email: "Tomer@gmail.com",
                password: "12345"
            })
            .expect(Unauthorized, done);
    })
    it('Login unsuccessful - Bad email',  (done) =>{
        request(app).post(route_login)
            .set('Cookie', cookie_prefix + SessionTest.sess_id)
            .send({
                email: "Tomer@gmailcom",
                password: "123456"
            })
            .expect(Unauthorized, done);
    })
    it('Login unsuccessful - user already logged',  (done) =>{
        request(app).post(route_login)
            .set('Cookie', cookie_prefix + SessionTest.sess_id)
            .send({
                email: "Tomer@gmail.com",
                password: "12345"
            })
            .expect(Unauthorized, done);
    })
});