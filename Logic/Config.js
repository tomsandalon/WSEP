
const fs = require('fs');
const path = require('path');

const configFileName = 'Config.json'

let server_host;
let server_port;
let externalServices;
let db_client;
let db_connection;
let isLoaded = false;
let isValid = false;
let printCache = false;
const loadConfig = () => {
    try{
        const data = JSON.parse(fs.readFileSync(path.join(__dirname, configFileName), 'utf8'));
        server_host = data['server_host'];
        server_port = data['server_port'];
        externalServices = data['externalServices']
        db_client = data['db_client']
        db_connection = data['db_connection']
        isLoaded = true;
        isValid = true;
        return true;
    } catch (err) {
        if(!printCache){
            console.log("Config.json has wrong syntax errors\nplease check the file and correct errors to be by the JSON Docs")
            printCache = true;
        }
        return false;
    }
}

exports.getServerHost = () => {
    if (!isLoaded) {
        loadConfig()
    }
    return server_host;
}
exports.getServerPort = () => {
    if (!isLoaded) {
        loadConfig()
    }
    return server_port;
}
exports.getExternalServices = () => {
    if (!isLoaded) {
        loadConfig()
    }
    return externalServices;
}
exports.getDB_Client = () => {
    if (!isLoaded) {
        loadConfig()
    }
    return db_client;
}
exports.getDB_Connection = () => {
    if (!isLoaded) {
        loadConfig()
    }
    return db_connection;
}
exports.configFileName = configFileName;

exports.loadConfig = () => loadConfig();

exports.isLoaded = () => isLoaded;
exports.isValid = () => isValid;
exports.clearCache = () => {
    isLoaded = false
    isValid = false;
    printCache = false;
    server_host = undefined;
    server_port = undefined;
    externalServices = undefined;
    db_client = undefined;
    db_connection = undefined;
}
/*
{
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
}
 */
