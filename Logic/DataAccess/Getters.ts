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
                    const rates = await trx.select().form().where(user.pk, u.user_id)
                    return {
                        user_id: u.user,
                        email: u.email,
                        password: u.password,
                        age: u.age,
                        purchases_ids: purchases.map((p: any) => p.purchase_id),
                        rates: rates.map((r: any) => {
                            return {
                                product_id: r.product_id,
                                rate: r.rate,
                            }
                        }),
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

export const groupBy = (managers: any[]): any[] =>{
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

export const GetPurchaseConditions = (policy_id: number) =>{
    return db.transaction( async (trx: any) =>{
        const query = (id: number) => trx.raw(`(SELECT simple_id as first, -1 as second FROM purchase_simple_condition where simple_id = ${id}) union
            (SELECT first, second FROM
                (SELECT composite_id as p_condition_id FROM purchase_composite_condition WHERE composite_id = ${id}) as Com INNER JOIN purchase_comprised
                on purchase_comprised.composite_id = Com.p_condition_id)`)
        const getType = (id: number) =>
            trx.raw(`SELECT type_id FROM ${purchase_simple_condition_type_of.name} WHERE ${purchase_simple_condition.pk} = ${id}`)
        const getOperator = (id: number) =>
            trx.raw(`SELECT operator_id FROM ${purchase_comprised.name} WHERE ${purchase_composite_condition.pk} = ${id}`)
        const f = async (pid: number): Promise<{value: any, type?: number, operator?: number, left?: any, right?: any}> =>{
            let res = (await query(pid))[0];
            if(res[0].first >= 0 && res[0].second >= 0){
                const operator = (await getOperator(pid))[0][0];
                const left = await f(res[0].first);
                const right = await f(res[0].second);
                return {
                    value: pid,
                    operator: operator.operator_id,
                    left: left,
                    right: right
                }
            } else {
                const type = (await getType(pid))[0][0];
                return {
                    value: pid,
                    type: type.type_id
                }
            }
        }
        return f(policy_id);
    })
}


// export const GetDiscount = (policy_id: number) =>{
//     return db.transaction( async (trx: any) =>{
//         const query = (id: number) => trx.raw(`(SELECT discount_id as first, -1 as second FROM discount_simple where discount_id = ${id}) union
//             (SELECT first, second FROM
//                 (SELECT discount_composite_id as discount_id FROM discount_composite WHERE discount_composite_id = ${id}) as Com INNER JOIN discount_comprised_composite
//                 on discount_comprised_composite.discount_composite_id = Com.discount_id) UNION
//             (SELECT discount_id as first, -2 as second FROM
//                 (SELECT discount_conditional_id FROM discount_conditional WHERE discount_conditional_id = ${id}) as Com INNER JOIN discount_comprised_conditional
//                 on discount_comprised_conditional.discount_conditional_id = Com.discount_conditional_id)`)
//         const f = async (did: number): Promise<{value: any, left?: any, right?: any}> =>{
//             let res = (await query(did))[0];
//             if(res[0].first >= 0 && res[0].second >= 0){
//                 const left = await f(res[0].first);
//                 const right = await f(res[0].second);
//                 return {
//                     value: did,
//                     left: left,
//                     right: right
//                 }
//             } else if(res[0].second == -2) {
//                 const left = await f(res[0].first);
//                 return {
//                     value: did,
//                     left: left
//                 }
//             } else return {value: did}
//         }
//         return f(policy_id);
//     })
// }

export const GetShopsInventory = () =>
    db.transaction(async (trx: any) => {
        // const shops = await trx.select(shop.pk).from(shop.name);
        // const products = await trx.select(product.pk).from(product.name)
        // const purchaseConditions =
    })
/*
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
        return trx(purchase_condition.name).whereIn(purchase_condition.pk, ids).del()
                .then(success)
                .catch(failure);
    })
 */
export const GetPurchases = () => new Promise(success);

export const GetPurchaseTypes = () => new Promise(success);

export const GetPurchaseConditionOperator = () => new Promise(success);

export const GetPurchaseConditionType = () => new Promise(success);

export const GetDiscountType = () => new Promise(success);

export const GetDiscountOperator = () => new Promise(success);

export const GetNotifications = () => new Promise(success);

