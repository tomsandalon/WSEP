import {expect} from "chai";
import {sleep} from "async-parallel";
const fs = require('fs')
let server: { close: () => void; };
// init server
// server = require('../Communication/Server');
describe('', () => {
    it('', () =>{
        console.log( fs.readFileSync('./Logic/Communication/Config/Pub.key', "utf8"))
    })
    // before('Init client in test suit', () => {
    //     client = require('./Client')();
    //
    // });
    // after('', () => {
    //     client.close();
    //     client2.close();
    //     server.close();
    // });
    // it('', () => {
    //     setTimeout(() => console.log("terminate"), 500);
    // });
});
