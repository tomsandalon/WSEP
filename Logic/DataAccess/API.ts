import {db} from './DB.config';
import {
    Basket, DiscountCompositeCondition, DiscountConditionalCondition, DiscountSimpleCondition,
    Notification,
    Permission,
    Product,
    Purchase,
    PurchaseCompositeCondition,
    PurchaseSimpleCondition,
    Rate,
    Shop,
    User
} from "./DTOS";
const {
    purchase_type,
    permission,
    user,
    shop,
    product,
    purchase,
    basket,
    offer,
    rates,
    available,
    owns,
    manages,
    notification,
    purchase_condition_type,
    purchase_condition,
    purchase_simple_condition,
    purchase_composite_condition,
    purchase_condition_operator,
    purchase_comprised,
    purchase_condition_allowed_in,
    purchase_simple_condition_type_of,
    discount,
    discount_operator,
    discount_allowed_in,
    discount_conditional,
    discount_simple,
    discount_composite,
    discount_comprised_composite,
    discount_comprised_conditional,
    discount_condition_type,
    discount_conditional_type_of,
} = require("./Tables");

const success = (_: any) => true;
const failure = (_: any) => false;
export const RegisterUser = (data: User) => new Promise(success)
    // db.transaction((trx: any) =>
    //     trx.insert(data).into(user.name)
    //         .then(success).catch(failure))

export const AddShop = (data: Shop) => new Promise(success)
    // db.transaction((trx: any) =>
    //     trx.insert(data).into(shop.name)
    //         .then(success).catch(failure))

export const AddItemToBasket = (data: Basket) => new Promise(success)
    // db.transaction((trx: any) =>
    //     trx.insert(data).into(basket.name)
    //         .then(success).catch(failure))

export const UpdateItemInBasket = (data: Basket) => new Promise(success)
    // // TODO IMPL =- UPDATE
    // db.transaction((trx: any) =>
    //     trx.insert(data).into(basket.name)
    //         .then(success).catch(failure))

export const DeleteItemInBasket = (data: Basket) => new Promise(success)
    // // TODO IMPL -- DELETE
    // db.transaction((trx: any) =>
    //     trx.insert(data).into(basket.name)
    //         .then(success).catch(failure))

export const AddProduct = (data: Product) => new Promise(success)
    // db.transaction((trx: any) =>
    //     trx.insert(data).into(product.name)
    //         .then(success).catch(failure))

export const UpdateProduct = (data: Product) => new Promise(success)
    // // TODO IMPL -- UPDATE
    // db.transaction((trx: any) =>
    //     trx.insert(data).into(product.name)
    //         .then(success).catch(failure))

export const RemoveProduct = (product_id: number) => new Promise(success)
    // // TODO IMPL -- DELETE
    // db.transaction((trx: any) =>
    //     trx.insert(data).into(product.name)
    //         .then(success).catch(failure))

export const AppointManager = (target_email: string, appointer_email: string, shop_id: number, permissions: Permission[]) => new Promise(success)
    // // TODO IMPL
    // db.transaction((trx: any) =>
    //     trx.insert(data).into(product.name)
    //         .then(success).catch(failure))

export const AppointOwner = (target_email: string, appointer_email: string, shop_id: number) => new Promise(success)
    // // TODO IMPL
    // db.transaction((trx: any) =>
    //     trx.insert(data).into(product.name)
    //         .then(success).catch(failure))

export const RemoveManager = (target_email: string, shop_id: number) => new Promise(success)
    // // TODO IMPL
    // db.transaction((trx: any) =>
    //     trx.insert(data).into(product.name)
    //         .then(success).catch(failure))

export const RemainingManagement = (management_emails: string[], shop_id: number) => new Promise(success)
    // // TODO IMPL
    // db.transaction((trx: any) =>
    //     trx.insert(data).into(product.name)
    //         .then(success).catch(failure))

export const UpdatePermissions = (manager_id: number, shop_id: number, new_permissions: Permission[]) => new Promise(success)
    // // TODO IMPL
    // db.transaction((trx: any) =>
    //     trx.insert(data).into(product.name)
    //         .then(success).catch(failure))

export const AddPurchasePolicy = (shop_id: number, policy_id: number, condition: PurchaseSimpleCondition | PurchaseCompositeCondition) => new Promise(success)
    // // TODO IMPL
    // db.transaction((trx: any) =>
    //     trx.insert(data).into(product.name)
    //         .then(success).catch(failure))

export const AddDiscount = (shop_id: number, discount_id: number, discount: DiscountSimpleCondition | DiscountCompositeCondition | DiscountConditionalCondition) => new Promise(success)
    // // TODO IMPL
    // db.transaction((trx: any) =>
    //     trx.insert(data).into(product.name)
    //         .then(success).catch(failure))

export const removeDiscount = (shop_id: number, discount_id: number,) => new Promise(success)
    // // TODO IMPL -- Cascading
    // db.transaction((trx: any) =>
    //     trx.insert(data).into(product.name)
    //         .then(success).catch(failure))

export const removePurchasePolicy = (shop_id: number, policy_id: number) => new Promise(success)
    // // TODO IMPL -- Cascading
    // db.transaction((trx: any) =>
    //     trx.insert(data).into(product.name)
    //         .then(success).catch(failure))

export const RateProduct = (rate: Rate) => new Promise(success)
    // // TODO IMPL -- Cascading
    // db.transaction((trx: any) =>
    //     trx.insert(data).into(product.name)
    //         .then(success).catch(failure))

export const Notify = (notifications: Notification[]) => new Promise(success)
    // // TODO IMPL -- Cascading
    // db.transaction((trx: any) =>
    //     trx.insert(data).into(product.name)
    //         .then(success).catch(failure))

export const ClearNotifications = (user_id: number) => new Promise(success)
    // // TODO IMPL
    // db.transaction((trx: any) =>
    //     trx.insert(data).into(product.name)
    //         .then(success).catch(failure))

/*
TODO add these fields to purchase table

purchase_id
product_id FK
purchase_type: number,
name: string,
base_price: number,
description: string,
categories: string,
payment: string
amount actual price
 */

export const PurchaseBasket = (user_id: number, shop_id: number, payment: string, purchase: Purchase[]) => new Promise(success)

// AddUser({
//     user_id: 5,
//     email: 'fff@gmail.com',
//     password: "1234",
//     age: 3
// }).then((result: any) => console.log(`Finish ${result}`))