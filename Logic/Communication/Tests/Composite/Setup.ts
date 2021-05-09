import {app} from "../../Server";
const expect = require('chai').expect;
import {chai, cookie_prefix, SessionTest} from "../Setup";
import {before, beforeEach} from "mocha";
import {BadRequest, OK, route_login, route_logout, route_register} from "../../Config/Config";
const request = require('supertest');

export const mainUser = "TomAndSons@gmail.com";
export const mainUser_pass = "123456";
before((done => {
    request(app).post(route_register)
        .set('Cookie', cookie_prefix + SessionTest.sess_id)
        .send({
            email: mainUser,
            password: mainUser_pass
        })
        .expect(OK, done);
    request(app).post(route_login)
        .set('Cookie', cookie_prefix + SessionTest.sess_id)
        .send({
            email: mainUser,
            password: mainUser_pass
        })
        .expect(OK, done);
}))
