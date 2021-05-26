import {db} from './DB.config';
import {
    Basket,
    DiscountCompositeCondition,
    DiscountConditionalCondition,
    DiscountSimpleCondition, isDiscountCompositeCondition,
    isDiscountSimpleCondition, isPurchaseCompositeCondition, isPurchaseSimpleCondition,
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
import {Purchase_Type} from "../Domain/Shop/ShopInventory";
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
        trx.insert({type_id: type}).into(purchase_condition_type.name)
            .then(success).catch(failure))

export const AddDiscountOperator = (operator: number) =>
    db.transaction((trx: any) =>
        trx.insert({discount_operator_id: operator}).into(discount_operator.name)
            .then(success).catch(failure))

export const AddDiscountConditionType = (type: number) =>
    db.transaction((trx: any) =>
        trx.insert({discount_condition_type_id: type}).into(discount_condition_type.name)
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
        trx(owns.name).insert({
            shop_id: shop_id,
            user_id: trx.raw("(SELECT user_id FROM user WHERE email = ?)", [target_email]),
            appointer_id: trx.raw("(SELECT user_id FROM user WHERE email = ?)", [appointer_email])
        }))

export const RemoveManager = (target_email: string, shop_id: number) =>
    db.transaction((trx: any) =>
        trx(manages.name)
            .where({
                shop_id: shop_id,
                user_id: trx.raw("(SELECT user_id FROM user WHERE email = ?)", [target_email])
            })
            .del())

export const RemainingManagement = (management_emails: string[], shop_id: number) =>
    db.transaction((trx: any) =>
        trx(owns.name)
            .where({shop_id: shop_id})
            .whereNotIn(user.pk,
                trx(user.name).select(user.pk).whereIn('email', management_emails))
            .del())

export const UpdatePermissions = (manager_id: number, shop_id: number, new_permissions: Permission[]) =>
    db.transaction((trx: any) =>
        trx(manages.name).select(permission.pk).whereIn(permission.pk, new_permissions)
            .then((used_permissions: any) =>
                Promise.all([
                    trx(manages.name)
                        .whereNotIn(user.pk, new_permissions)
                        .del()
                ].concat(new_permissions.reduce((acc: any[], perm: any) =>
                    perm in used_permissions ? acc : acc.concat([
                        trx(manages.name).insert({
                        shop_id: shop_id,
                        manager_id: manager_id,
                        permission_id: perm,
                    })]), [])))))

export const AddPurchasePolicy = (shop_id: number, policy_id: number, condition: PurchaseSimpleCondition | PurchaseCompositeCondition) =>
    isPurchaseSimpleCondition(condition)?
        db.transaction((trx: any) =>
            trx.insert({p_condition_id: policy_id}).into(purchase_condition.name)
                .then((_: any) =>
                    trx.insert({
                        simple_id: policy_id,
                        value: condition.value
                    }).into(purchase_simple_condition.name))
                .then((_: any) =>
                    trx.insert({
                        type_id: condition.purchase_condition,
                        simple_id: policy_id
                    }).into(purchase_simple_condition_type_of.name))
                .then((_: any) =>
                    trx(purchase_condition_allowed_in.name).insert({
                        shop_id: shop_id,
                        p_condition_id: policy_id
                    }))):
        db.transaction((trx: any) =>
            trx.insert({p_condition_id: policy_id}).into(purchase_condition.name)
                .then((_: any) => trx.insert({composite_id: policy_id}).into(purchase_composite_condition.name))
                .then((_: any) =>
                    trx.insert({
                        operator_id: condition.operator,
                        composite_id: policy_id,
                        first: condition.first_policy,
                        second: condition.second_policy,
                    }).into(purchase_comprised.name))
                .then((_: any) => trx.insert({shop_id: shop_id, p_condition_id: policy_id}).into(purchase_condition_allowed_in.name))
                .then((_: any) =>
                        trx(purchase_condition_allowed_in.name)
                            .where({
                                shop_id: shop_id,
                            })
                            .andWhere((query: any) =>
                                query.where(purchase_condition.pk, condition.first_policy).orWhere(purchase_condition.pk, condition.second_policy))
                            .del()))

export const AddDiscount = (shop_id: number, discount_id: number, discount_to_add: DiscountSimpleCondition | DiscountCompositeCondition | DiscountConditionalCondition) =>
    isDiscountSimpleCondition(discount_to_add)?
        db.transaction((trx: any) =>
            trx.insert({discount_id: discount_id}).into(discount.name)
                .then((_: any) =>
                    trx.insert({
                        discount_id: discount_id,
                        value: discount_to_add
                    }).into(discount_simple.name))
                .then((_: any) =>
                    trx(discount_allowed_in.name).insert({
                        shop_id: shop_id,
                        discount_id: discount_id
                    }))):
    isDiscountCompositeCondition(discount_to_add)?
        db.transaction((trx: any) =>
            trx.insert({discount_id: discount_id}).into(discount.name)
                .then((_: any) => trx.insert({discount_composite_id: discount_id}).into(discount_composite.name))
                .then((_: any) =>
                    trx(discount_comprised_composite.name).insert({
                        discount_operator_id: discount_to_add.operator,
                        discount_composite_id: discount_id,
                        first: discount_to_add.first_policy,
                        second: discount_to_add.second_policy,
                    }))
                .then((_: any) => trx.insert({shop_id: shop_id, discount_id: discount_id}).into(discount_allowed_in.name))
                .then((_: any) =>
                    trx(discount_allowed_in.name)
                        .where({
                            shop_id: shop_id,
                        })
                        .andWhere((query: any) =>
                            query.where(discount.pk, discount_to_add.first_policy).orWhere(discount.pk, discount_to_add.second_policy))
                        .del())):
            db.transaction((trx: any) =>
                trx.insert({discount_id: discount_id}).into(discount.name)
                    .then((_: any) => trx(discount_conditional.name).insert({
                        discount_conditional_id: discount_id,
                        discount_param: discount_to_add.discount_param,
                    }))
                    .then((_: any) =>
                        trx.insert({
                            discount_conditional_id: discount_id,
                            discount_id: discount_to_add.operand_discount,
                        }).into(discount_comprised_conditional.name))
                    .then((_: any) =>
                        trx(discount_conditional_type_of.name)
                            .insert({
                                discount_conditional_id: discount_id,
                                discount_condition_type_id: discount_to_add.discount_condition
                            }))
                    .then((_: any) =>
                        trx(discount_allowed_in.name)
                            .insert({
                                discount_id: discount_id,
                                shop_id: shop_id
                            }))
                    .then((_: any) =>
                        trx(discount_allowed_in.name)
                            .where({
                                shop_id: shop_id,
                                discount_id: discount_to_add.operand_discount,
                            })
                            .del()))


export const removeDiscount = (shop_id: number, discount_id: number,) =>{
    let ids: any[] = []
    let pending: number[] = []
    return db.transaction( async (trx: any) =>{
            const query = (id: number) => trx.raw(`(SELECT discount_id as first, -1 as second FROM discount_simple where discount_id = ${id}) union
            (SELECT first, second FROM
                (SELECT discount_composite_id as discount_id FROM discount_composite WHERE discount_composite_id = ${id}) as Com INNER JOIN discount_comprised_composite
                on discount_comprised_composite.discount_composite_id = Com.discount_id) UNION
            (SELECT discount_id as first, -2 as second FROM
                (SELECT discount_conditional_id FROM discount_conditional WHERE discount_conditional_id = ${id}) as Com INNER JOIN discount_comprised_conditional
                on discount_comprised_conditional.discount_conditional_id = Com.discount_conditional_id)`)
            ids.push(discount_id);
            let res = (await query(discount_id))[0];
            while (res.length != 0 || pending.length != 0){
                if(res[0].first >= 0 && res[0].second >= 0){
                    pending.push(res[0].first, res[0].second)
                } else if(res[0].second == -2){
                    pending.push(res[0].first)
                }
                if(pending.length == 0) break;
                let [next, ...temp] = pending;
                ids.push(next);
                pending = temp;
                res = (await query(next))[0];
            }
        return trx(discount.name).whereIn(discount.pk, ids).del();
    })
}

export const removePurchasePolicy = (shop_id: number, policy_id: number) => {
    let ids: any[] = []
    let pending: number[] = []
    return db.transaction( async (trx: any) =>{
        const query = (id: number) => trx.raw(`(SELECT simple_id as first, -1 as second FROM purchase_simple_condition where simple_id = ${id}) union
            (SELECT first, second FROM
                (SELECT composite_id as p_condition_id FROM purchase_composite_condition WHERE composite_id = ${id}) as Com INNER JOIN purchase_comprised
                on purchase_comprised.composite_id = Com.p_condition_id)`)
        ids.push(policy_id);
        let res = (await query(policy_id))[0];
        while (res.length != 0 || pending.length != 0){
            if(res[0].first >= 0 && res[0].second >= 0){
                pending.push(res[0].first, res[0].second)
            } else if(res[0].second == -2){
                pending.push(res[0].first)
            }
            if(pending.length == 0) break;
            let [next, ...temp] = pending;
            ids.push(next);
            pending = temp;
            res = (await query(next))[0];
        }
        return trx(purchase_condition.name).whereIn(purchase_condition.pk, ids).del();
    })
}

export const RateProduct = (rate: Rate) =>
    db.transaction((trx: any) =>
        trx.insert(rate).into(rates.name)
            .then(success).catch(failure))

export const Notify = (notifications: Notification[]) =>
    db.transaction((trx: any) =>
        Promise.all(
            notifications.map((message: Notification) =>
                trx(notification.name)
                    .insert({
                        user_id: message.user_id,
                        notification_id: message.notification_id,
                        notification: message.notification,
                    }))))

export const ClearNotifications = (user_id: number) =>
    db.transaction((trx: any) =>
        trx(notification.name).where(user.pk, user_id).del())

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
