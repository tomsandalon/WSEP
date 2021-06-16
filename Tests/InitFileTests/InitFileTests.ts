import 'mocha';
import {assert, expect} from 'chai';
import {Service} from "../../Logic/Service/Service";
import {validInput} from "./ValidInput";
import {invalidInput} from "./InvalidInput";

const {initData} = require("../../Logic/Init.ts");
const fs = require('fs');
const path = require('path');

const writeToInit = (data: string) => fs.writeFileSync(path.join(__dirname, '..', '..', 'Actions.json'), data)
describe('Init file tests', () => {
    after(() => {
        writeToInit(validInput)
    })
    it('Load Init file with good JSON syntax', async () => {
        writeToInit(validInput)
        const service = new Service();
        try{
            await service.init()
        } catch (e) {
            assert.fail('Error system initialization')
        }
        try {
            await initData(service)
        } catch (e) {
            assert.fail('init data failed')
        }
    });
    it('Load init file with bad JSON syntax', async () => {
        writeToInit(invalidInput)
        const service = new Service();
        try{
            await service.init()
        } catch (e) {
            assert.fail('Error system initialization')
        }
        try{
            await initData(service)
            assert.fail('System should not load successfully')
        } catch (_) {}
    });
});