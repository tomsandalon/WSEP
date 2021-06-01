import {Service} from "../../Service/Service";
import {Publisher} from "../../Service/Publisher";
const {server_host, server_port} = require('../../Config')
const path = require('path')
const fs = require('fs')
export const host = server_host
export const port = server_port
export const config_path = "./Logic/Communication/Config/";
export const key_file = "server_key.pem";
export const cert_file = "server_cert.pem";
export const options = {
    key: fs.readFileSync(path.join(__dirname, key_file), "utf8"),
    cert: fs.readFileSync(path.join(__dirname, cert_file), "utf8"),
};
export const sid = 'SID';
export const sid_regex = /^SID=\d*$/;
export const service: Service = new Service();

export class Session {
    public static publisher = Publisher.getInstance()
    public static sessions: {
        [session_id: number] : {
            user_id: number,
            socket: any
        }
    } = {};
    public static session_id_specifier = 1;
}

export const BadRequest = 400;
export const Unauthorized = 401;
export const ServerNotFound = 404;
export const OK = 200;

export const details = '/details'
export const rate = '/rate'
export const categories = '/categories'
export const assign_manager = '/assign/manager'
export const assign_owner = '/assign/owner'
export const permissions = '/permissions'
export const isAdmin = '/is/admin'
export const isManager = '/is/manager'
export const isOwner = '/is/owner'
export const isLoggedIn = '/is/loggedin'

export const shop_purchase_history = '/purchase_history'
export const purchase_cart = "/all"
export const second = 1000;
export const minute = 60 * second;
export const hour = 60 * minute;
export const day = 24 * hour;
export const localhost = 'https://localhost:' + port;