import {
    assign_manager,
    assign_owner,
    categories, details, isAdmin, isLoggedIn, isManager, isOwner, offer,
    permissions,
    purchase_cart, purchase_type,
    rate, shop_offer,
    shop_purchase_history, user_offer
} from "./Config/Config";

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
/**
 * @method GET
 * @function getManagingShops
 * @params user_id
 * @return 404 -> server not found error -> text
 // * @return 400 -> error -> text
 * @return 200 -> json
 */
export const route_user_management = "/user"

/**
 * @method GET
 * @function getPermissions
 * @params user_id, shop_id
 * @location body
 * @return 404 -> server not found error -> text
 * @return 400 -> error -> text
 * @return 200 -> json
 */
export const route_user_management_permissions = route_user_management + permissions

/**
 * @method GET
 * @function isLoggedIn
 * @params user_id
 * @return 404 -> server not found error -> text
 * @return 400 -> error -> text
 * @return 200 -> text -> boolean
 */
export const route_user_management_is_logged_in = route_user_management + isLoggedIn

/**
 * @method GET
 * @function isAdmin
 * @params user_id
 * @return 404 -> server not found error -> text
 * @return 400 -> error -> text
 * @return 200 -> text -> boolean
 */
export const route_user_management_is_admin = route_user_management + isAdmin

/**
 * @method GET
 * @function isManager
 * @params user_id
 * @return 404 -> server not found error -> text
 * @return 400 -> error -> text
 * @return 200 -> text -> boolean
 */
export const route_user_management_is_manager = route_user_management + isManager

/**
 * @method GET
 * @function isOwner
 * @params user_id
 * @return 404 -> server not found error -> text
 * @return 400 -> error -> text
 * @return 200 -> text -> boolean
 */
export const route_user_management_is_owner = route_user_management + isOwner

/**
 * @method GET
 * @function getUserEmailFromUserId
 * @params user_id
 * @return 404 -> error -> server not found mssg
 * @return 400 -> error -> text
 * @return 200 -> text -> email
 */
export const route_user_management_details = route_user_management + details;

/**
 * @method DELETE
 * @function removeProduct
 * @params user_id, shop_id, product_id
 * @location body
 * @return 404 -> error -> server not found mssg
 * @return 400 -> error -> text
 * @return 200 -> json
 *
 *
 * @method PUT
 * @function editProduct
 * @params user_id, shop_id, product_id, action, value
 * @location body
 * @return 404 -> error -> server not found mssg
 * @return 400 -> error -> text
 * @return 200 -> json
 *
 *
 * @method POST
 * @function addProduct
 * @params user_id, shop_id, name, description, amount, categories, base_price,
 * @location body
 * @return 404 -> error -> server not found mssg
 * @return 400 -> error -> text
 * @return 200 -> json
 */
export const route_shop_manage_product = "/user/shop/product"
export const route_shop_management = "/user/shop/management"
export const route_shop_ownership = "/user/shop/ownership"
/**
 * @method GET
 * @function getAllPurchasePolicies
 * @params user_id, shop_id
 * @location query
 * @return 404 -> error -> server not found mssg
 * @return 401 -> error -> text
 * @return 200 -> json
 *
 * @method DELETE
 * @function removePurchasePolicy
 * @params user_id, shop_id, policy_id
 * @location query
 * @return 404 -> error -> server not found mssg
 * @return 401 -> error -> text
 * @return 200 -> OK
 *
 * @method PUT
 * @function composePurchasePolicy
 * @params user_id, shop_id, policy_id_first, policy_id_second, operator
 * @location query
 * @return 404 -> error -> server not found mssg
 * @return 401 -> error -> text
 * @return 200 -> OK
 *
 * @method POST
 * @function addPurchasePolicy
 * @params user_id, shop_id, condition, value
 * @location query
 * @return 404 -> error -> server not found mssg
 * @return 401 -> error -> text
 * @return 200 -> json
 */
export const route_shop_policy = "/user/shop/policy"
/**
 * @method GET
 * @function getAllDiscounts
 * @params user_id, shop_id
 * @location query
 * @return 404 -> error -> server not found mssg
 * @return 401 -> error -> text
 * @return 200 -> json
 *
 * @method DELETE
 * @function removeDiscount
 * @params user_id, shop_id, id
 * @location query
 * @return 404 -> error -> server not found mssg
 * @return 401 -> error -> text
 * @return 200 -> OK
 *
 * @method POST
 * @location body
 ** If request = 1 => addDiscount => params user_id, shop_id, value
 ** If request = 2 => addConditionToDiscount => params user_id, shop_id, id, condition, condition_param
 ** If request = 3 => addNumericComposeDiscount => params user_id, shop_id, operation, discount_id_one, discount_id_two
 ** If request = 4 => addLogicComposeDiscount => params user_id, shop_id, operation, discount_id_one, discount_id_two
 * @return 404 -> error -> server not found mssg
 * @return 400 -> error -> text
 * @return 401 -> error -> text
 * @return 200 -> OK
 */
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
 * @location query
 * @return 404 -> error -> server not found mssg
 * @return 400 -> error -> text
 * @return 200 -> json
 */
export const route_shop_purchase_history = route_shop + shop_purchase_history

/**
 * @method POST
 * @function addPurchaseType
 * @params user_id, shop_id, purchase_type
 ** Purchase_type is 0 or 1 if not you get bad request code
 * @location body
 * @return 404 -> error -> server not found mssg
 * @return 400 -> error -> text
 * @return 200 -> OK
 *
 * @method DELETE
 * @function removePurchaseType
 * @params user_id, shop_id, purchase_type
 ** Purchase_type is 0 or 1 if not you get bad request code
 * @location body
 * @return 404 -> error -> server not found mssg
 * @return 400 -> error -> text
 * @return 200 -> OK
 */
export const route_shop_purchase_type = route_shop + purchase_type

/**
 * @method PUT
 * @function rateProduct
 * @params user_id, shop_id, product_id, rating
 * @location body
 * @return 404 -> error -> server not found mssg
 * @return 400 -> error -> text
 * @return 200 -> OK
 */
export const route_shop_manage_product_rating = route_shop_manage_product + rate;

/**
 * @method GET
 * @function offerIsPurchasable
 * @params user_id
 * @return 404 -> error -> server not found mssg
 * @return 400 -> error -> text
 * @return 200 -> text
 *
 * @method POST
 * @function purchaseOffer
 * @params user_id, offer_id, payment_info
 * @location body
 * @return 404 -> error -> server not found mssg
 * @return 400 -> error -> text
 * @return 200 -> OK
 */
export const route_offer = offer;

/**
 * @method GET
 * @function getActiveOffersAsUser
 * @params user_id
 * @return 404 -> error -> server not found mssg
 * @return 400 -> error -> text
 * @return 200 -> JSON
 *
 * @method POST
 * @function makeOffer
 * @params user_id, shop_id, product_id, amount, price_per_unit
 * @location body
 * @return 404 -> error -> server not found mssg
 * @return 400 -> error -> text
 * @return 200 -> OK
 *
 * @method PUT
 * @location body
 ** If action = 'Deny' => denyCounterOfferAsUser => params user_id, offer_id
 ** If action = 'Counter' => counterOfferAsUser => params user_id, shop_id, offer_id, new_price_per_unit
 * @return 404 -> error -> server not found mssg
 * @return 400 -> error -> text
 * @return 200 -> OK
 */
export const route_offer_user = offer + user_offer;

/**
 * @method GET
 * @function getActiveOfferForShop
 * @params user_id
 * @return 404 -> error -> server not found mssg
 * @return 400 -> error -> text
 * @return 200 -> JSON
 *
 * @method POST
 * @location body
 ** If action = 'Accept' => acceptOfferAsManagement => params user_id, shop_id, offer_id
 ** If action = 'Deny' => denyOfferAsManagement => params user_id, shop_id, offer_id
 ** If action = 'Counter' => counterOfferAsManager => params shop_id, offer_id, new_price_per_unit
 * @return 404 -> error -> server not found mssg
 * @return 400 -> error -> text
 * @return 200 -> OK
 */
export const route_offer_shop = offer + shop_offer;

