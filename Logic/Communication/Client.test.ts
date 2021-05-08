import {sleep} from "async-parallel";
import {app, server} from "./Server";
import nock from "nock";
import {sid} from "./Config/Config";
import {afterEach, beforeEach} from "mocha";
const fs = require('fs')
const https = require('https');
const request = require('supertest');
const chai = require('chai');
const expect = require('chai').expect;
const chaiNock = require('chai-nock');
chai.use(chaiNock);
describe('Server API tests', () => {
    const cookie_prefix = 'SID=';
    let sess_id = -1;
    beforeEach((done) =>{
        request(app).get('/guest')
            .expect(200)
            .then((res: any) =>{
                sess_id = res.headers['set-cookie'].find((cookie: any) => cookie.startsWith(sid))
                    .split(';')[0]
                    .split('=')[1];
                done();
            })
            .catch((err: any) => done(err));
    })
    afterEach((done) => {
        server.close();
        done();
    })
    describe('Login tests', () => {
        it('Login successful',  (done) =>{
            request(app).post('/login')
                .set('Cookie', cookie_prefix + sess_id)
                .send({
                    email: "Tomer@gmail.com",
                    password: "123456"
                })
                .expect(200, done);
        })
        it('Login unsuccessful - Bad password',  (done) =>{
            request(app).post('/login')
                .set('Cookie', cookie_prefix + sess_id)
                .send({
                    email: "Tomer@gmail.com",
                    password: "12345"
                })
                .expect(401, done);
        })
        it('Login unsuccessful - Bad email',  (done) =>{
            request(app).post('/login')
                .set('Cookie', cookie_prefix + sess_id)
                .send({
                    email: "Tomer@gmail.com",
                    password: "12345"
                })
                .expect(401, done);
        })
        it('Login unsuccessful - user already logged',  (done) =>{
            request(app).post('/login')
                .set('Cookie', cookie_prefix + sess_id)
                .send({
                    email: "Tomer@gmail.com",
                    password: "12345"
                })
                .expect(401, done);
        })
    })
    describe('Registration tests', () => {
        it('Registration unsuccessful - bad email - no @',  (done) =>{
            request(app).post('/registration')
                .set('Cookie', cookie_prefix + sess_id)
                .send({
                    email: "Nethanelgmail.com",
                    password: "123456"
                })
                .expect(400, done);
        })
        it('Registration unsuccessful - bad email - no dot',  (done) =>{
            request(app).post('/registration')
                .set('Cookie', cookie_prefix + sess_id)
                .send({
                    email: "Nethanel@gmailcom",
                    password: "123456"
                })
                .expect(400, done);
        })
        it('Registration unsuccessful - email empty',  (done) =>{
            request(app).post('/registration')
                .set('Cookie', cookie_prefix + sess_id)
                .send({
                    email: "",
                    password: "123456"
                })
                .expect(400, done);
        })
        it('Registration unsuccessful - password empty',  (done) =>{
            request(app).post('/registration')
                .set('Cookie', cookie_prefix + sess_id)
                .send({
                    email: "Nethanel@gmail.com",
                    password: ""
                })
                .expect(400, done);
        })
        it('Registration successful',  (done) =>{
            request(app).post('/registration')
                .set('Cookie', cookie_prefix + sess_id)
                .send({
                    email: "Nethanel@gmail.com",
                    password: "123456"
                })
                .expect(200, done);
        })
    })
});
