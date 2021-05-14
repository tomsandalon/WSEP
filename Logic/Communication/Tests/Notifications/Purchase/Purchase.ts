import {app} from "../../../Server";
const expect = require('chai').expect;
import {chai, cookie_prefix, NotificationTest} from "../Setup";
import {beforeEach} from "mocha";
import {OK, route_login, route_register, Unauthorized} from "../../../Config/Config";
const request = require('supertest');
describe('Purchase Notifications Tests', function () {
    before(function (done) {
        // request(app).post(route_register)
        //     .set('Cookie', cookie_prefix + NotificationTest.user_one_sess_id)
        //     .send({
        //         email: "Tomer@gmail.com",
        //         password: "123456"
        //     })
        //     .expect(OK, done);
    });
    beforeEach(() =>{
        expect(NotificationTest.user_one_sess_id).not.equal('')
    })
    it('Purchase successful',  (done) =>{
        request(app).post(route_login)
            .set('Cookie', cookie_prefix + NotificationTest.user_one_sess_id)
            .send({
                email: "Tomer@gmail.com",
                password: "123456"
            })
            .expect(OK, done);
    })
});