import {sleep} from "async-parallel";
import {app} from "./Server";
import nock from "nock";
const fs = require('fs')
const https = require('https');
const request = require('request');
const chai = require('chai');
const chaiNock = require('chai-nock');
chai.use(chaiNock);
describe('', () => {
    it('',  async () =>{
        // nock('https://localhost:8000/')
        //     .get('/home').
        //     ;
        // console.log(res)
            // .send({name: "Charlie", age: "9", breed: "Pomerian"})
        // let sid = -1;
        // const options = {
        //     method: 'GET',
        //     port: 8000,
        //     hostname: 'localhost',
        //     path: '/home'
        // };
        // const happy = () => new Promise((resolve) =>{
        //     https.request(options, (res: any) => {
        //         console.log("Here")
        //         console.log(res.headers);
        //     })
        // })
        // request('https://localhost:8000/home', (err: any, res: any, body: any) => {
        //     console.log(err);
        //     console.log(res);
        //     console.log(body);
        // })
        // // const sad = (v, ms) => new Promise((_, reject) => setTimeout(() => reject(v), ms))
        // //
        // Promise.all([happy()])
        //     .then(console.log) // [{ "status":"fulfilled", "value":"happy" }, { "status":"rejected", "reason":"sad" }]
    })

});
