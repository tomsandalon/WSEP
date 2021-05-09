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

export class Session {
    public static sessions: {[session_id: number] : number} = {};
    public static session_id_specifier = 1;
}

export const BadRequest = 400;
export const Unauthorized = 401;
export const ServerNotFound = 404;
export const OK = 200;
export const route_register = "/register"
export const route_login = "/login"
export const route_logout = "/logout"
export const route_shop = "/user/shop"
export const route_shop_manage_product = "/user/shop/product"
export const route_shop_management = "/user/shop/management"
export const route_shop_ownership = "/user/shop/ownership"
