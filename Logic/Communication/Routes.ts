import {assign_manager, assign_owner, categories, purchase_cart, shop_purchase_history} from "./Config/Config";

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
/**
 * @method GET
 * @function getItemsFromShop
 * @params name, description, location, bank_info
 * @location body
 * @return 404 -> server not found error -> text
 * @return 400 -> error -> text
 * @return 200 -> json
 *
 * @method POST
 * @function addShop
 * @params shop_id
 * @location body
 * @return 404 -> server not found error -> text
 * @return 400 -> error -> text
 * @return 200 -> shop_id as text
 */
export const route_shop = "/user/shop"
export const route_admin = "/user/admin"
export const route_user_management = "/user"
export const route_shop_manage_product = "/user/shop/product"
export const route_shop_management = "/user/shop/management"
export const route_shop_ownership = "/user/shop/ownership"
export const route_shop_policy = "/user/shop/policy"
export const route_shop_discount = "/user/shop/discount"
/**
 * @method GET
 * @function getAllCategories
 * @params user_id
 * @location body
 * @return 404 -> error -> server not found mssg
 * @return 400 -> error -> text
 * @return 200 -> json
 */
export const route_shop_categories = route_shop + categories
export const route_shop_ownership_assign_manager = route_shop_ownership + assign_manager
export const route_shop_ownership_assign_owner = route_shop_ownership + assign_owner
/**
 * @method GET
 * @function shopOrderHistory
 * @params user_id, shop_id
 * @location body
 * @return 404 -> error -> server not found mssg
 * @return 400 -> error -> text
 * @return 200 -> json
 */
export const route_shop_purchase_history = route_shop + shop_purchase_history
