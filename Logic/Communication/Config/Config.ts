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

export const permissions = '/permissions'
export const shop_purchase_history = '/purchase_history'
export const purchase_cart = "/all"
export const route_notifications = "/"
export const route_guest = "/guest"
export const route_register = "/register"
export const route_login = "/login"
export const route_logout = "/logout"
export const route_cart = "/cart"
export const route_purchase = "/purchase"
export const route_purchase_cart = route_purchase + purchase_cart
export const route_home = "/home"
export const route_filter = "/home/filter"
export const route_shop = "/user/shop"
export const route_admin = "/user/admin"
export const route_shop_manage_product = "/user/shop/product"
export const route_shop_management = "/user/shop/management"
export const route_shop_ownership = "/user/shop/ownership"
export const assign_manager = '/assign/manager'
export const assign_owner = '/assign/owner'
export const route_shop_ownership_assign_manager = route_shop_ownership + assign_manager
export const route_shop_ownership_assign_owner = route_shop_ownership + assign_owner
export const second = 1000;
export const minute = 60 * second;
export const hour = 60 * minute;
export const day = 24 * hour;
export const localhost = 'https://localhost:' + port;