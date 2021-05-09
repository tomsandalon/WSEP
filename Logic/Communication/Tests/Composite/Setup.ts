import {app} from "../../Server";
const expect = require('chai').expect;
import {chai, cookie_prefix, SessionTest} from "../Setup";
import {before, beforeEach} from "mocha";
import {BadRequest, OK, route_login, route_logout, route_register} from "../../Config/Config";
const request = require('supertest');

before((done => {
    request(app).post(route_register)
        .set('Cookie', cookie_prefix + SessionTest.sess_id)
        .send({
            email: "TomAndSons@gmail.com",
            password: "123456"
        })
        .expect(OK, done);
    request(app).post(route_login)
        .set('Cookie', cookie_prefix + SessionTest.sess_id)
        .send({
            email: "TomAndSons@gmail.com",
            password: "123456"
        })
        .expect(OK, done);
}))
