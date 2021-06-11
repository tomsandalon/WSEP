import * as https from 'https';
import {
    assign_manager,
    assign_owner,
    options,
    permissions,
    port,
    service,
} from "./Config/Config";
import {
    route_admin,
    route_cart,
    route_filter, route_guest,
    route_home,
    route_login,
    route_logout,
    route_purchase,
    route_register,
    route_shop,
    route_shop_discount,
    route_shop_manage_product,
    route_shop_management,
    route_shop_ownership,
    route_shop_policy,
    route_user_management
} from "./Routes";
import {configWebSocket} from "./User/Notification";
const socket_io = require('socket.io');
const fs = require('fs')
const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const {loadConfig, isLoaded} = require('../Config');
export const app = express();
//initialize a https server
export const server = https.createServer(options, app);
export const io = socket_io(server,
    {
    cors: {
        origin: "http://localhost:3000",
        credentials: true
    }
      });
configWebSocket(io)
//start our server
const initServer = () => {
    service.init().then(_ => service.initData()).then(_ => console.log('Ready'));

    server.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    })
    app.use(cookieParser());
    app.use(express.json());
    app.use(express.urlencoded({extended: false}));
    app.use(route_guest, require('./User/Guest'))
    app.use(route_login, require('./User/Registered/Login'));
    app.use(route_logout, require('./User/Registered/Logout'))
    app.use(route_register, require('./User/Register'));
    app.use(route_cart, require('./User/Cart'));
    app.use(route_purchase, require('./User/Purchase'));
    app.use(route_home, require('./Home/Home'));
    app.use(route_filter, require('./Home/Filter'));
    app.use(route_shop_management, require('./User/Registered/Management'));
    app.use(route_shop_ownership, require('./User/Registered/Ownership'));
    app.use(route_shop_manage_product, require('./User/Registered/Product'))
    app.use(route_shop, require('./User/Registered/Shop'));
    app.use(route_admin, require('./User/Registered/Admin'));
    app.use(route_user_management, require('./User/Registered/User'));
    app.use(route_shop_policy, require('./User/Registered/Policy'));
    app.use(route_shop_discount, require('./User/Registered/Discount'));
}

if(isLoaded() || loadConfig()){
    initServer();
} else {
    console.log("Server cannot read config file\nAborting...")
}
