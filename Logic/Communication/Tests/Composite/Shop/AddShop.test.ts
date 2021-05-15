import {app} from "../../../Server";
const expect = require('chai').expect;
import {chai, cookie_prefix, SessionTest} from "../../Setup";
import {beforeEach} from "mocha";
import {BadRequest, OK} from "../../../Config/Config";
import {route_shop} from "../../../Routes";
const request = require('supertest');

describe('Add Shop tests', () => {
    beforeEach(() =>{
        expect(SessionTest.sess_id).not.equal('')
    })
    it('Add Shop unsuccessfully - no name',  (done) =>{
        request(app).post(route_shop)
            .set('Cookie', cookie_prefix + SessionTest.sess_id)
            .send({
                name: "",
                description: "BEST GPU 4 Ever",
                location: "Taiwan",
                bank_info: "Taiwan 4 ever"
            })
            .expect(BadRequest, done);
    })
    it('Add Shop unsuccessfully - no description',  (done) =>{
        request(app).post(route_shop)
            .set('Cookie', cookie_prefix + SessionTest.sess_id)
            .send({
                name: "NIVIDIA",
                description: "",
                location: "Taiwan",
                bank_info: "Taiwan 4 ever"
            })
            .expect(BadRequest, done);
    })

    it('Add Shop unsuccessfully - no location',  (done) =>{
        request(app).post(route_shop)
            .set('Cookie', cookie_prefix + SessionTest.sess_id)
            .send({
                name: "NIVIDIA",
                description: "BEST GPU 4 Ever",
                location: "",
                bank_info: "Taiwan 4 ever"
            })
            .expect(BadRequest, done);
    })
    it('Add Shop unsuccessfully - no bank info',  (done) =>{
        request(app).post(route_shop)
            .set('Cookie', cookie_prefix + SessionTest.sess_id)
            .send({
                name: "NIVIDIA",
                description: "BEST GPU 4 Ever",
                location: "Taiwan",
                bank_info: ""
            })
            .expect(BadRequest, done);
    })
    it('Add Shop successfully',  (done) =>{
        request(app).post(route_shop)
            .set('Cookie', cookie_prefix + SessionTest.sess_id)
            .send({
                name: "NIVIDIA",
                description: "BEST GPU 4 Ever",
                location: "Taiwan",
                bank_info: "Taiwan 4 ever"
            })
            .expect(OK, done);
    })
})