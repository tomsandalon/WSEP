import {app, server} from "../Server";
import {sid} from "../Config/Config";
import {afterEach, beforeEach} from "mocha";

const fs = require('fs')
const https = require('https');
const request = require('supertest');
export const chai = require('chai');
const expect = require('chai').expect;
const chaiNock = require('chai-nock');
chai.use(chaiNock);
export const cookie_prefix = 'SID=';

export class SessionTest {
    public static sess_id = '';
}

beforeEach((done) =>{
    request(app).get('/guest')
        .expect(200)
        .then((res: any) =>{
            SessionTest.sess_id = res.headers['set-cookie'].find((cookie: any) => cookie.startsWith(sid))
                .split(';')[0]
                .split('=')[1];
            console.log(SessionTest.sess_id)
            done();
        })
        .catch((err: any) => done(err));
})
afterEach((done) => {
    server.close();
    done();
})
