import * as https from 'https';
import {
    options,
    port, route_admin,
    route_cart, route_filter,
    route_guest, route_home,
    route_login, route_logout, route_purchase,
    route_register, route_shop, route_shop_management, route_shop_ownership,
    service,
} from "./Config/Config";

const fs = require('fs')
const path = require('path');
const express = require('express');
const expressWs = require('express-ws');
const cookieParser = require('cookie-parser');
export const app = express();
//initialize a https server
export const server = https.createServer(options, app);
//start our server
server.listen( port,() => {
    console.log(`Server is running on port ${port}`);
})
expressWs(app, server);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(route_guest, require('./User/Guest'))
app.use(route_login, require('./User/Registered/Login'));
// app.use(route_logout, require('./User/Registered/Logout'))
app.use(route_register, require('./User/Register'));
app.use(route_cart, require('./User/Cart'));
app.use(route_purchase, require('./User/Purchase'));
app.use(route_home, require('./Home/Home'));
app.use(route_filter, require('./Home/Filter'));
app.use(route_shop_management, require('./User/Registered/Management'));
app.use(route_shop_ownership, require('./User/Registered/Ownership'));
app.use(route_shop, require('./User/Registered/Shop'));
app.use(route_admin, require('./User/Registered/Admin'));

//* For debug TODO delete this

service.initData();