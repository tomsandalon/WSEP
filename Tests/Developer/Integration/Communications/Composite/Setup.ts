import {app} from "../../../../../Logic/Communication/Server";
import {cookie_prefix, SessionTest} from "../Setup";
import {before} from "mocha";
import {OK} from "../../../../../Logic/Communication/Config/Config";
import {route_login, route_register} from "../../../../../Logic/Communication/Routes";

const expect = require('chai').expect;
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
