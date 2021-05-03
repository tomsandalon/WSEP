const WebSocket = require("ws");
const {sleep} = require("async-parallel");
const fs = require('fs')
const path = require('path')
const https = require('https')
const config_path = "./Logic/Communication/Config/";
const key_file = "server_key.pem";
const cert_file = "server_cert.pem";
const ca_file = "server_cert.pem"
const options = {
    hostname: 'localhost',
    port: 8000,
    path: '/',
    method: 'GET',
    key: fs.readFileSync(config_path + key_file, "utf8"),
    cert: fs.readFileSync(config_path + cert_file, "utf8"),
    requestCert: true,
    rejectUnauthorized: true,
    Cookie: undefined,
    ca: [ fs.readFileSync(config_path + ca_file) ],
}
const options_login = {
    hostname: 'localhost',
    port: 8000,
    path: '/login',
    method: 'POST',
    key: fs.readFileSync(config_path + key_file, "utf8"),
    cert: fs.readFileSync(config_path + cert_file, "utf8"),
    requestCert: true,
    rejectUnauthorized: true,
    Cookie: undefined,
    ca: [ fs.readFileSync(config_path + ca_file) ],
}

const req = https.request(options);
const SessionData = {};
const sid = 'SID';
req.on('response', function (res) {
    const cookies = getAllCookies(res.rawHeaders);
    SessionData[sid] = cookies.reduce((acc, cookie) => cookie[0] === "SID"? cookie[1]: acc, -1);
    res.on('data', function (chunk) {
        console.log('BODY: ' + chunk);
    });
    const req = https.request(options_login);
    req.on('response', function (res) {

    })
    req.setHeader('set-cookie', SessionData[sid]);
    req.write(JSON.stringify({
        username: "Mark",
        password: "12345"
    }));
});
req.end()

function getAllCookies (cookies){
    let result = [];
    for (let i = 0; i < cookies.length; i++) {
        if(cookies[i] === 'Set-Cookie'){
            result.push(cookies[i+1].split(';', 1)[0].split('='))
            i++;
        }
    }
    return result;
}