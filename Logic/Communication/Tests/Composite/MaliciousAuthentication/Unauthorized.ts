import {app} from "../../../Server";
const expect = require('chai').expect;
import {cookie_prefix, SessionTest} from "../../Setup";
import {before, beforeEach} from "mocha";
import {
    BadRequest,
    OK, sid, Unauthorized,
} from "../../../Config/Config";
import {mainUser, mainUser_pass} from "../Setup";
import {route_guest, route_login, route_register, route_shop_management} from "../../../Routes";
const request = require('supertest');
let second_user_sid = '';
describe('Add Manager to Shop tests', () =>{
    const dummyUser = 'annaBanana@gmail.com';
    const dummyUser_password = 'qwerty';
    before(done => {
        request(app).get(route_guest)
            .expect(BadRequest)
            .then((res: any) =>{
                second_user_sid = res.headers['set-cookie'].find((cookie: any) => cookie.startsWith(sid))
                    .split(';')[0]
                    .split('=')[1];
                done();
            })
            .catch((err: any) => done(err));
    })
    beforeEach(() =>{
        expect(SessionTest.sess_id).not.equal('')
        expect(second_user_sid).not.equal('')
    })
    it('Logged user tries to register, same session id', (done) => {
        request(app).post(route_register)
            .set('Cookie', cookie_prefix + SessionTest.sess_id)
            .send({
                email: dummyUser,
                password: dummyUser_password
            })
            .expect(Unauthorized, done);
    })
    it('Logged user tries to register, different session id', (done) => {
        request(app).post(route_register)
            .set('Cookie', cookie_prefix + second_user_sid)
            .send({
                email: dummyUser,
                password: dummyUser_password
            })
            .expect(Unauthorized, done);
    })
    it('Logged user tries to Login again, same session id', (done) => {
        request(app).post(route_register)
            .set('Cookie', cookie_prefix + SessionTest.sess_id)
            .send({
                email: mainUser,
                password: mainUser_pass
            })
            .expect(Unauthorized, done);
    })
    it('Logged user tries to Login again, different session id', (done) => {
        request(app).post(route_login)
            .set('Cookie', cookie_prefix + second_user_sid)
            .send({
                email: mainUser,
                password: mainUser_pass
            })
            .expect(Unauthorized, done);
    })
})
