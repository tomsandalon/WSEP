import {Service} from "../../Service/Service";
const path = require('path')
const fs = require('fs')
export const host = 'localhost'
export const port = 8000
export const config_path = "./Logic/Communication/Config/";
export const key_file = "server_key.pem";
export const cert_file = "server_cert.pem";
export const options = {
    key: fs.readFileSync(path.join(__dirname, key_file), "utf8"),
    cert: fs.readFileSync(path.join(__dirname, cert_file), "utf8"),
};
export const sid = 'SID';
export const service: Service = new Service();