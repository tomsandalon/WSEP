import 'mocha';
import {assert, expect} from 'chai';
import {validInput} from "./ValidInput";
import {invalidInput} from "./InvalidInput";
import {Service} from "../../Logic/Service/Service";
const {initData} = require("../../Logic/Init.ts");
const fs = require('fs');
const path = require('path');

const writeToConfig = (data: string) => fs.writeFileSync(path.join(__dirname, '..', '..', 'Logic', 'Init.json'), data)
describe('Init file tests', () => {
    it('Load Init file with good JSON syntax', async () => {
        // try{
        //     writeToConfig(validInput)
        // } catch (e) {
        //     assert.fail('Error in writing to file\n' + e)
        // }
        const service = new Service();
        await initData(service)
        let temp = 0;
    });
    // it('Load config file with bad JSON syntax', () => {
    //     try{
    //         writeToConfig(invalidInput)
    //     } catch (e) {
    //         assert.fail('Error in writing to file\n' + e)
    //     }
    //
    // });
});