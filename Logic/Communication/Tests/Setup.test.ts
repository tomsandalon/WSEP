import {sleep} from "async-parallel";
import {app, server} from "../Server";
import nock from "nock";
import {sid} from "../Config/Config";
import {afterEach, before, beforeEach} from "mocha";
import {SessionTest} from "./Config.test";
const fs = require('fs')
const https = require('https');
const request = require('supertest');
export const chai = require('chai');
const expect = require('chai').expect;
const chaiNock = require('chai-nock');
chai.use(chaiNock);
export const cookie_prefix = 'SID=';
before(()=>{
    console.log("Server API tests")
})
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
