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

export const GetUsers = () =>
    db.transaction((trx: any) =>
        trx.select().from(user.name)
            .then((users: any[]) =>
                Promise.all(
                    users.map(async (u: any) => {
                    const purchases = await trx.select().from(purchase.name).where(user.pk, u.user_id)
                    const baskets = await trx.select().from(basket.name).where(user.pk, u.user_id)
                    return {
                        user_id: u.user,
                        email: u.email,
                        password: u.password,
                        age: u.age,
                        purchases_ids: purchases.map((p: any) => p.purchase_id),
                        cart: baskets.map((b: any) => {
                            return {
                                shop_id: b.shop_id,
                                product_id: b.product_id,
                                amount: b.amount
                            }
                        })
                        }
                    })
                )
            )
    )

export const GetShopsRaw = () =>
    db.transaction((trx: any) =>
        trx.select().from(shop.name)
            .then((shops: any[]) =>
                shops.map((s: any) => {
                    return {
                        shop_id: s.shop_id,
                        original_owner: s.user_id,
                        name: s.name,
                        description: s.description,
                        location: s.location,
                        bank_info: s.bank_info,
                        active: s.active,
                    }
                })
            )
    )

const groupBy = (managers: any[]): any[] =>{
    managers.sort((first: any, second: any) => first.manager_id - second.manager_id)
    let output = [];
    let flag = -1;
    for (let i = 0; i < managers.length; i++) {
        if (flag == managers[i].manager_id) {
            output[output.length - 1].permissions.push(managers[i].permission)
        } else {
            flag = managers[i].manager_id;
            output.push({
                manager_id: managers[i].manager_id,
                appointer_id: managers[i].appointer_id,
                permissions: [managers[i].permission]
            })
        }
    }
    return output;
};

export const GetShopsManagement = () =>
    db.transaction(async (trx: any) => {
            const shops = await trx.select(shop.pk).from(shop.name);
            const owners = (await trx.raw(`SELECT * FROM 
                           (SELECT ${shop.pk} FROM ${shop.name}) as A INNER JOIN ${owns.name} ON A.${shop.pk} = ${owns.name}.${shop.pk}`))[0]
            const managers = (await trx.raw(`SELECT * FROM 
                        (SELECT ${shop.pk} FROM ${shop.name}) as A INNER JOIN ${manages.name} ON A.${shop.pk} = ${manages.name}.${shop.pk}`))[0]
            return shops.map((s: any) => {
                return {
                    shop_id: s.shop_id,
                    owners: owners.filter((o: any) => o.shop_id == s.shop_id),
                    managers: groupBy(managers.filter((m: any) => m.shop_id == s.shop_id).map((m: any) => {
                        return {
                            manager_id: m.user_id,
                            appointer_id: m.appointer_id,
                            permission: m.permission_id
                        }
                    }))
                }
            })
        }
    )

export const GetShopsInventory = () =>


export const GetPurchases = () => new Promise(success);

export const GetPurchaseTypes = () => new Promise(success);

export const GetPurchaseConditionOperator = () => new Promise(success);

export const GetPurchaseConditionType = () => new Promise(success);

export const GetDiscountType = () => new Promise(success);

export const GetDiscountOperator = () => new Promise(success);

export const GetNotifications = () => new Promise(success);

