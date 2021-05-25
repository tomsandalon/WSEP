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
const failure = (err: any) => {
    console.log(err)
    return false;
}
export const AddPermission = (perm: Permission) =>
    db.transaction((trx: any) =>
        trx.insert({permission_id: perm}).into(permission.name)
            .then(success).catch(failure))

export const AddPurchaseConditionOperator = (operator: number) =>
    db.transaction((trx: any) =>
        trx.insert({operator_id: operator}).into(purchase_condition_operator.name)
            .then(success).catch(failure))

export const AddPurchaseConditionType = (type: number) =>
    db.transaction((trx: any) =>
        trx.insert({type_id: type}).into(purchase_condition_operator.name)
            .then(success).catch(failure))

export const AddDiscountOperator = (operator: number) =>
    db.transaction((trx: any) =>
        trx.insert({operator_id: operator}).into(discount_operator.name)
            .then(success).catch(failure))

export const AddDiscountConditionType = (type: number) =>
    db.transaction((trx: any) =>
        trx.insert({type_id: type}).into(discount_condition_type.name)
            .then(success).catch(failure))

export const AddPurchaseType = (type: number) =>
    db.transaction((trx: any) =>
        trx.insert({purchase_type_id: type}).into(purchase_type.name)
            .then(success).catch(failure))
export const RegisterUser = (data: User) =>
    db.transaction((trx: any) =>
        trx.insert(data).into(user.name)
            .then(success).catch(failure))

export const AddShop = (data: Shop) =>
    db.transaction((trx: any) =>
        trx.insert(data).into(shop.name)
            .then(success).catch(failure))

export const AddItemToBasket = (data: Basket) =>
    db.transaction((trx: any) =>
        trx.insert(data).into(basket.name)
            .then(success).catch(failure))

export const UpdateItemInBasket = (data: Basket) =>
    db(basket.name)
        .where({
            shop_id: data.shop_id,
            user_id: data.user_id,
            product_id: data.product_id,
        })
        .update({
            amount: data.amount
        })
        .then(success)
        .catch(failure)

export const DeleteItemInBasket = (data: Basket) =>
    db(basket.name)
        .where({
            shop_id: data.shop_id,
            user_id: data.user_id,
            product_id: data.product_id,
        })
        .del()
        .then(success)
        .catch(failure)

export const AddProduct = (data: Product) =>
    db.transaction((trx: any) =>
        trx.insert(data).into(product.name)
            .then(success).catch(failure))

export const UpdateProduct = (data: Product) =>
    db(product.name)
        .where({
            shop_id: data.product_id,
        })
        .update({
            purchase_type_id: data.purchase_type_id,
            name: data.name,
            amount: data.amount,
            base_price: data.base_price,
            description: data.description,
            categories: data.categories,
        })
        .then(success)
        .catch(failure)

export const RemoveProduct = (product_id: number) =>
    db(product.name)
        .where({
            product_id: product_id,
        })
        .del()
        .then(success)
        .catch(failure)

export const AppointManager = (target_email: string, appointer_email: string, shop_id: number, permissions: Permission[]) =>
    db.transaction((trx: any) =>
        Promise.all(permissions.map((perm) =>
            trx(manages.name).insert({
                shop_id: shop_id,
                permission_id: perm,
                user_id: trx.raw("(SELECT user_id FROM user WHERE email = ?)", [target_email]),
                appointer_id: trx.raw("(SELECT user_id FROM user WHERE email = ?)", [appointer_email])
            }))))

export const AppointOwner = (target_email: string, appointer_email: string, shop_id: number) =>
    db.transaction((trx: any) =>
        trx.raw('INSERT INTO owns (user_id, shop_id, appointer_id)' +
            ' SELECT user_id, ? as shop_id, ? as permission_id, appointer_id FROM' +
            ' (SELECT user_id FROM user WHERE email = ?) as appointee, (SELECT user_id as appointer_id FROM user WHERE email = ?) as appointer',
            [shop_id, target_email, appointer_email]))

export const RemoveManager = (target_email: string, shop_id: number) =>
    db.transaction((trx: any) =>
        trx(manages.name)
            .raw('SELECT user_id, ? as shop_id FROM manages WHERE user_id = ?', [shop_id, target_email])
            .del())
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
