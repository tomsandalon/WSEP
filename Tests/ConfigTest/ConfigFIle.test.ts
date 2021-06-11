import 'mocha';
import {assert, expect} from 'chai';
const fs = require('fs');
const path = require('path');
const {configFileName, getServerHost, getServerPort, getExternalServices, getDB_Client, getDB_Connection, clearCache} = require('../../Logic/Config');

const validInput = `{
  "server_host": "localhost",
  "server_port": 8000,
  "externalServices": "https://cs-bgu-wsep.herokuapp.com/",
  "db_client": "mysql",
  "db_connection": {
    "host": "127.0.0.1",
    "database": "wsep",
    "user":     "Mark",
    "password": "FuckUniv2021",
    "charset": "utf8"
  }
}`

const invalidInput = `{
    "server_host": "localhost",
    "server_port": 8000,
    "externalServices": "https://cs-bgu-wsep.herokuapp.com/",
    "db_client": "mysql",
    "db_connection": {
        "host": "127.0.0.1",
        "database": "wsep",
        "user":     "Mark",
        "password": "FuckUniv2021",
        "charset": "utf8"`

const writeToConfig = (data: string) => fs.writeFileSync(path.join(__dirname, '..', '..', 'Logic', configFileName), data)

describe('Config file tests', () => {
    beforeEach(() => {
        clearCache()
    })
    it('Load config file with good JSON syntax', () => {
        try{
            writeToConfig(validInput)
        } catch (e) {
            assert.fail('Error in writing to file\n' + e)
        }
        expect(getServerHost()).equal('localhost')
        expect(getServerPort()).equal(8000)
        expect(getDB_Client()).equal("mysql")
        expect(getDB_Connection())
            .deep
            .equal({
            host: "127.0.0.1",
            database: "wsep",
            user:     "Mark",
            password: "FuckUniv2021",
            charset: "utf8"
        })
        expect(getExternalServices()).equal("https://cs-bgu-wsep.herokuapp.com/")
    });
    it('Load config file with bad JSON syntax', () => {
        try{
            writeToConfig(invalidInput)
        } catch (e) {
            assert.fail('Error in writing to file\n' + e)
        }
        expect(getServerHost()).equal(undefined)
        expect(getServerPort()).equal(undefined)
        expect(getDB_Client()).equal(undefined)
        expect(getDB_Connection()).equal(undefined)
        expect(getExternalServices()).equal(undefined)
    });
});