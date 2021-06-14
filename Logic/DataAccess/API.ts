import {
    Basket,
    DiscountCompositeCondition,
    DiscountConditionalCondition,
    DiscountSimpleCondition,
    isDiscountCompositeCondition,
    isDiscountSimpleCondition,
    isPurchaseSimpleCondition,
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
import {panicLogger} from "../Domain/Logger";

const {
    purchase_type,
    permission,
    user,
    shop,
    product,
    purchase,
    basket,
    offer,
    offer_not_accepted_by,
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
const {getDB, connectToDB, isConnectedToDB, getBuilder, config} = require('./DB.config')

const success = (_: any) => true;
const failure = async (func_name: string, err: any, f: TryAgain, input: any, currAttempt: number) => {
    if(currAttempt > 0){
        await f(input, currAttempt - 1)
    } else {
        panicLogger.Critical('Error in function ' + func_name + '\nvalues\n' + JSON.stringify(input, null, 2) + 'Err Mssg\n' + err)
    }
    return false;
}

const handler = (func_name, err, f, data, attempts) =>
    failure(func_name, err, f, data, attempts)
        .then(x => x).catch(new_err => handler(func_name, new_err, f, data, attempts))


type TryAgain = (_: any, attemps: number) => any

export const RegisterUser = (data: User) => _RegisterUser(data, 3)

const _RegisterUser = (data: User, attempts: number) =>
    getDB().transaction((trx: any) =>
        trx.insert({
            user_id: data.user_id,
            email: data.email,
            password: data.password,
            age: data.age,
            admin: data.admin,
        }).into(user.name)
    )
        .then(success)
        .catch(new_err => handler("RegisterUser", new_err, _RegisterUser, data, attempts))

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const reconnect = async () => {
    while (true){
        await timeout(500)
        console.log('Reconnecting...')
        try {
            connectToDB()
        }catch (_) {}
        if(await isConnectedToDB()){
            break;
        }
    }
    console.log('\nReconnected!')
}

export const ConnectToDB = async (): Promise<boolean> => {
    try{
        connectToDB()
        console.log('\nConnected')
    } catch (_) {}
    if (!await isConnectedToDB()) {
        await reconnect();
        return true;
    }
    return true;
}

export const CreateAdminIfNotExist = (user_id: number, user_email: string, hashed_pass: string, age: number): Promise<boolean> => _CreateAdminIfNotExist([user_id, user_email, hashed_pass, age], 3)

const _CreateAdminIfNotExist = ([user_id, user_email, hashed_pass, age]: [number, string, string, number], attempts: number): Promise<boolean> =>
    getDB().transaction(async (trx: any) => {
        const result = await trx.select().from(user.name).where({user_id: user_id})
        if (result.length == 0) {
            await trx.insert({
                user_id: user_id,
                email: user_email,
                password: hashed_pass,
                age: age,
                admin: 1,
            }).into(user.name)
        }
    })
        .then(success)
        .catch(new_err => handler('CreateAdminIfNotExist', new_err, _CreateAdminIfNotExist, [user_id, user_email, hashed_pass, age], attempts))

export const AddShop = (data: Shop) => _AddShop(data, 3)

const _AddShop = (data: Shop, attempts: number) =>
    getDB().transaction(async (trx: any) => {
        await trx.insert({
            shop_id: data.shop_id,
            user_id: data.user_id,
            name: data.name,
            description: data.description,
            location: data.location,
            bank_info: data.bank_info,
            active: data.active,
        }).into(shop.name)
        await trx(available.name).insert(data.purchase_type.map(p_type => {
            return {
                shop_id: data.shop_id,
                purchase_type_id: p_type
            }
        }))
    })
        .then(success)
        .catch(new_err => handler('AddShop', new_err, _AddShop, data, attempts))

export const AddItemToBasket = (data: Basket) => _AddItemToBasket(data, 3)

const _AddItemToBasket = (data: Basket, attempts: number) =>
    getDB().transaction((trx: any) =>
        trx.insert(data).into(basket.name)
    )
        .then(success)
        .catch(new_err => handler('AddItemToBasket', new_err, _AddItemToBasket, data, attempts))

export const UpdateItemInBasket = (data: Basket) => _UpdateItemInBasket(data, 3)

const _UpdateItemInBasket = (data: Basket, attempts: number) =>
    getDB()(basket.name)
        .where({
            shop_id: data.shop_id,
            user_id: data.user_id,
            product_id: data.product_id,
        })
        .update({
            amount: data.amount
        })
        .then(success)
        .catch(new_err => handler('UpdateItemInBasket', new_err, _UpdateItemInBasket, data, attempts))

export const DeleteItemInBasket = (data: Basket) => _DeleteItemInBasket(data, 3)
const _DeleteItemInBasket = (data: Basket, attempts: number) =>
    getDB()(basket.name)
        .where({
            shop_id: data.shop_id,
            user_id: data.user_id,
            product_id: data.product_id,
        })
        .del()
        .then(success)
        .catch(new_err => handler('DeleteItemInBasket', new_err, _DeleteItemInBasket, data, attempts))

export const AddProduct = (data: Product) => _AddProduct(data, 3)

const _AddProduct: TryAgain = (data: Product, attempts: number) =>{
    return getDB().transaction((trx: any) =>
        trx.insert(data).into(product.name)
            )
        .then(success).catch(new_err => handler('AddProduct', new_err, _AddProduct, data, attempts))
}
export const UpdateProduct = (data: Product) => _UpdateProduct(data, 3)

const _UpdateProduct = (data: Product, attempts: number) =>
    getDB()(product.name)
        .where({
            shop_id: data.product_id,
        })
        .update({
            purchase_type: data.purchase_type,
            name: data.name,
            amount: data.amount,
            base_price: data.base_price,
            description: data.description,
            categories: data.categories,
        })
        .then(success)
        .catch(new_err => handler('UpdateProduct', new_err, _UpdateProduct, data, attempts))


export const RemoveProduct = (product_id: number) => _RemoveProduct(product_id, 3)

const _RemoveProduct = (product_id: number, attempts: number) =>
    getDB()(product.name)
        .where({
            product_id: product_id,
        })
        .del()
        .then(success)
        .catch(new_err => handler('RemoveProduct', new_err, _RemoveProduct, product_id, attempts))

export const AppointManager = (target_email: string, appointer_email: string, shop_id: number, permissions: Permission[]) =>
    _AppointManager([target_email, appointer_email, shop_id, permissions], 3)

const _AppointManager = ([target_email, appointer_email, shop_id, permissions]: [string, string, number, Permission[]], attempts: number) =>
    getDB().transaction(async (trx: any) => {
        await Promise.all(permissions.map((perm) =>
            trx(manages.name).insert({
                shop_id: shop_id,
                permission_id: perm,
                user_id: trx.raw("(SELECT user_id FROM user WHERE email = ?)", [target_email]),
                appointer_id: trx.raw("(SELECT user_id FROM user WHERE email = ?)", [appointer_email])
            })))
        await trx(offer_not_accepted_by.name).insert(
            trx.from({
                A: trx.select(user.pk).from(user.name).where({email: target_email})
            }).crossJoin({
                B: trx(offer_not_accepted_by.name).distinct(offer.pk)
            })
        )
    })
        .then(success)
        .catch(new_err => handler('AppointManager', new_err, _AppointManager, [target_email, appointer_email, shop_id, permissions], attempts))

export const AppointOwner = (target_email: string, appointer_email: string, shop_id: number) =>
    _AppointOwner([target_email, appointer_email, shop_id], 3)

const _AppointOwner = ([target_email, appointer_email, shop_id]: [string, string, number], attempts: number) =>
    getDB().transaction(async (trx: any) => {
        await trx(owns.name).insert({
            shop_id: shop_id,
            user_id: trx.raw("(SELECT user_id FROM user WHERE email = ?)", [target_email]),
            appointer_id: trx.raw("(SELECT user_id FROM user WHERE email = ?)", [appointer_email])
        })
        await trx(offer_not_accepted_by.name).insert(
            trx.from({
                A: trx.select(user.pk).from(user.name).where({email: target_email})
            }).crossJoin({
                B: trx(offer_not_accepted_by.name).distinct(offer.pk)
            })
        )
    })
        .then(success)
        .catch(new_err => handler('AppointOwner', new_err, _AppointOwner, [target_email, appointer_email, shop_id], attempts))

export const RemoveManager = (target_email: string, shop_id: number) =>
    _RemoveManager([target_email, shop_id], 3)

const _RemoveManager = ([target_email, shop_id]: [string, number], attempts: number) =>
    getDB().transaction(async (trx: any) => {
        await trx(manages.name)
            .where({
                shop_id: shop_id,
                user_id: trx.raw("(SELECT user_id FROM user WHERE email = ?)", [target_email])
            })
            .del()
        await trx.from(offer_not_accepted_by.name).whereIn(user.pk,
                    trx.select(user.pk).from(user.name).where({email: target_email})
                ).del()
    })
        .then(success)
        .catch(new_err => handler('RemoveManager', new_err, _RemoveManager, [target_email, shop_id], attempts))

export const RemainingManagement = (management_emails: string[], shop_id: number) =>
    _RemainingManagement([management_emails, shop_id], 3)

const _RemainingManagement = ([management_emails, shop_id]: [string[], number], attempts: number) =>
    getDB().transaction(async (trx: any) => {
        await trx(owns.name)
            .where({shop_id: shop_id})
            .whereNotIn(user.pk,
                trx(user.name).select(user.pk).whereIn('email', management_emails))
            .del()
        await trx.from(offer_not_accepted_by.name).whereIn(user.pk,
            trx.select(user.pk).from(user.name).whereNotIn('email', management_emails)
        ).del()
    })
        .then(success)
        .catch(new_err => handler('RemainingManagement', new_err, _RemainingManagement, [management_emails, shop_id], attempts))

export const UpdatePermissions = (manager_id: number, shop_id: number, new_permissions: Permission[]) =>
    _UpdatePermissions([manager_id, shop_id, new_permissions], 3)

const _UpdatePermissions = ([manager_id, shop_id, new_permissions]:[number, number, Permission[]], attempts: number) =>
    getDB().transaction((trx: any) =>
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
                        })]), []))))
    )
        .then(success)
        .catch(new_err => handler('UpdatePermissions', new_err, _UpdatePermissions, [manager_id, shop_id, new_permissions], attempts))

export const AddPurchasePolicy = (shop_id: number, policy_id: number, condition: PurchaseSimpleCondition | PurchaseCompositeCondition) =>
    _AddPurchasePolicy([shop_id, policy_id, condition], 3)

const _AddPurchasePolicy = ([shop_id, policy_id, condition]: [number, number, PurchaseSimpleCondition | PurchaseCompositeCondition], attempts: number) =>
    isPurchaseSimpleCondition(condition)?
        getDB().transaction((trx: any) =>
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
                    }))
        )
            .then(success)
            .catch(new_err => handler('AddPurchasePolicy', new_err, _AddPurchasePolicy, [shop_id, policy_id, condition], attempts))
        :
        getDB().transaction((trx: any) =>
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
                        .del())
        )
            .then(success)
            .catch(new_err => handler('AddPurchasePolicy', new_err, _AddPurchasePolicy, [shop_id, policy_id, condition], attempts))

export const AddDiscount = (shop_id: number, discount_id: number, discount_to_add: DiscountSimpleCondition | DiscountCompositeCondition | DiscountConditionalCondition) =>
    _AddDiscount([shop_id, discount_id, discount_to_add], 3)

const _AddDiscount = ([shop_id, discount_id, discount_to_add]: [number, number, DiscountSimpleCondition | DiscountCompositeCondition | DiscountConditionalCondition], attempts: number) =>
    isDiscountSimpleCondition(discount_to_add)?
        getDB().transaction((trx: any) =>
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
                    }))
        )
            .then(success)
            .catch(new_err => handler('AddDiscount', new_err, _AddDiscount, [shop_id, discount_id, discount_to_add], attempts))
        :
        isDiscountCompositeCondition(discount_to_add)?
            getDB().transaction((trx: any) =>
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
                            .del())
            )
                .then(success)
                .catch(new_err => handler('AddDiscount', new_err, _AddDiscount, [shop_id, discount_id, discount_to_add], attempts))
            :
            getDB().transaction((trx: any) =>
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
                            .del())
            )
                .then(success)
                .catch(new_err => handler('AddDiscount', new_err, _AddDiscount, [shop_id, discount_id, discount_to_add], attempts))

export const removeDiscount = (shop_id: number, discount_id: number,) =>
    _removeDiscount([shop_id, discount_id], 3)

const _removeDiscount = ([shop_id, discount_id]: [number, number], attempts: number) =>{
    let ids: any[] = []
    let pending: number[] = []
    return getDB().transaction( async (trx: any) =>{
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
        return trx(discount.name).whereIn(discount.pk, ids).del()
    })
        .then(success)
        .catch(new_err => handler('removeDiscount', new_err, _removeDiscount, [shop_id, discount_id], attempts))
}

export const removePurchasePolicy = (shop_id: number, policy_id: number) =>
    _removePurchasePolicy([shop_id, policy_id], 3)

const _removePurchasePolicy = ([shop_id, policy_id]: [number, number], attempts: number) => {
    let ids: any[] = []
    let pending: number[] = []
    return getDB().transaction( async (trx: any) =>{
        const query = (id: number) => trx.raw(`(SELECT simple_id as first, -1 as second FROM purchase_simple_condition where simple_id = ${id}) union
            (SELECT first, second FROM
                (SELECT composite_id as p_condition_id FROM purchase_composite_condition WHERE composite_id = ${id}) as Com INNER JOIN purchase_comprised
                on purchase_comprised.composite_id = Com.p_condition_id)`)
        ids.push(policy_id);
        let res = (await query(policy_id))[0];
        while (res.length != 0 || pending.length != 0){
            if(res[0].first >= 0 && res[0].second >= 0){
                pending.push(res[0].first, res[0].second)
            }
            if(pending.length == 0) break;
            let [next, ...temp] = pending;
            ids.push(next);
            pending = temp;
            res = (await query(next))[0];
        }
        return trx(purchase_condition.name).whereIn(purchase_condition.pk, ids).del()
    })
        .then(success)
        .catch(new_err => handler('removePurchasePolicy', new_err, _removePurchasePolicy, [shop_id, policy_id], attempts))
}

export const RateProduct = (rate: Rate) => _RateProduct(rate, 3)

const _RateProduct = (rate: Rate, attempts: number) =>
    getDB().transaction((trx: any) =>
        trx.insert({
            user_id: rate.user_id,
            p_id: rate.product_id,
            rate: rate.rate,
        }).into(rates.name)
    )
        .then(success)
        .catch(new_err => handler('RateProduct', new_err, _RateProduct, rate, attempts))

export const Notify = (notifications: Notification[]) => _Notify(notifications, 3)

const _Notify = (notifications: Notification[], attempts: number) =>
    getDB().transaction((trx: any) =>
        Promise.all(
            notifications.map((message: Notification) =>
                trx(notification.name)
                    .insert({
                        user_id: message.user_id,
                        notification_id: message.notification_id,
                        notification: message.notification,
                    })))
    )
        .then(success)
        .catch(new_err => handler('Notify', new_err, _Notify, notifications, attempts))


export const ClearNotifications = (user_id: number) => _ClearNotifications(user_id, 3)

const _ClearNotifications = (user_id: number, attempts: number) =>
    getDB().transaction((trx: any) =>
        trx(notification.name).where(user.pk, user_id).del()
    )
        .then(success)
        .catch(new_err => handler('ClearNotifications', new_err, _ClearNotifications, user_id, attempts))

export const PurchaseBasket = (user_id: number, shop_id: number, purchase_id: number, date: Date,  items: Purchase[]) =>
    _PurchaseBasket([user_id, shop_id, purchase_id, date, items], 3)

const _PurchaseBasket = ([user_id, shop_id, purchase_id, date,  items]: [number, number, number, Date, Purchase[]], attempts: number) =>
    getDB().transaction((trx: any) =>
        Promise.all(items.map((item: Purchase) =>
            trx.raw(`UPDATE ${product.name} SET amount = amount - ${item.amount} WHERE ${product.pk} = ${item.product_id}`)
        ))
            .then((_: any) =>
                trx(basket.name)
                    .where({
                        shop_id: shop_id,
                        user_id: user_id,
                    })
                    .whereIn(product.pk, items.map((item) => item.product_id))
                    .del())
            .then((_: any) =>
                trx(purchase.name).insert(items.map((item) => {
                    return {
                        user_id: user_id,
                        shop_id: shop_id,
                        purchase_id: purchase_id,
                        product_id: item.product_id,
                        name: item.name,
                        categories: item.categories,
                        description: item.description,
                        base_price: item.base_price,
                        amount: item.amount,
                        actual_price: item.actual_price,
                        timestamp: date,
                    }
                }))
            )
    )
        .then(success)
        .catch(new_err => handler('PurchaseBasket', new_err, _PurchaseBasket, [user_id, shop_id, purchase_id, date,  items], attempts))

export const addPurchaseTypes = (types: number[]) => _addPurchaseTypes(types, 3)

const _addPurchaseTypes = (types: number[], attempts: number) =>
    getDB().transaction(async (trx: any) => {
        const result = (await trx.select().from(purchase_type.name)).map(r => r.purchase_type_id)
        const types_to_add = types.filter(t => !(result.includes(t)));
        await trx(purchase_type.name).insert(types_to_add.map(t => {
            return {
                purchase_type_id: t
            }
        }))
    })
        .then(success)
        .catch(new_err => handler('addPurchaseTypes', new_err, _addPurchaseTypes, types, attempts))

export const addPermissions = (permissions: number[]) => _addPermissions(permissions, 3)

const _addPermissions = (permissions: number[], attempts: number) =>
    getDB().transaction(async (trx: any) => {
        const result = (await trx.select().from(permission.name)).map(r => r.permission_id)
        const permissions_to_add = permissions.filter(p => !(result.includes(p)));
        await trx(permission.name).insert(permissions_to_add.map(p => {
            return {
                permission_id: p
            }
        }))
    })
        .then(success)
        .catch(new_err => handler('addPermissions', new_err, _addPermissions, permissions, attempts))

export const addPurchaseConditionType = (types: number[]) => _addPurchaseConditionType(types, 3)

const _addPurchaseConditionType = (types: number[], attempts: number) =>
    getDB().transaction(async (trx: any) => {
        const result = (await trx.select().from(purchase_condition_type.name)).map(r => r.type_id)
        const types_to_add = types.filter(t => !(result.includes(t)));
        await trx(purchase_condition_type.name).insert(types_to_add.map(t => {
            return {
                type_id: t
            }
        }))
    })
        .then(success)
        .catch(new_err => handler('addPurchaseConditionType', new_err, _addPurchaseConditionType, types, attempts))

export const addPurchaseConditionOperator = (operators: number[]) => _addPurchaseConditionOperator(operators, 3)

const _addPurchaseConditionOperator = (operators: number[], attempts: number) =>
    getDB().transaction(async (trx: any) => {
        const result = (await trx.select().from(purchase_condition_operator.name)).map(r => r.operator_id)
        const operators_to_add = operators.filter(o => !(result.includes(o)));
        await trx(purchase_condition_operator.name).insert(operators_to_add.map(o => {
            return {
                operator_id: o
            }
        }))
    })
        .then(success)
        .catch(new_err => handler('addPurchaseConditionOperator', new_err, _addPurchaseConditionOperator, operators, attempts))

export const addDiscountOperator = (operators: number[]) => _addDiscountOperator(operators, 3)

const _addDiscountOperator = (operators: number[], attempts: number) =>
    getDB().transaction(async (trx: any) => {
        const result = (await trx.select().from(discount_operator.name)).map(r => r.discount_operator_id)
        const operators_to_add = operators.filter(o => !(result.includes(o)));
        await trx(discount_operator.name).insert(operators_to_add.map(o => {
            return {
                discount_operator_id: o
            }
        }))
    })
        .then(success)
        .catch(new_err => handler('addDiscountOperator', new_err, _addDiscountOperator, operators, attempts))

export const addDiscountConditionType = (types: number[]) => _addDiscountConditionType(types, 3)

const _addDiscountConditionType = (types: number[], attempts: number) =>
    getDB().transaction(async (trx: any) => {
        const result = (await trx.select().from(discount_condition_type.name)).map(r => r.discount_condition_type_id)
        const types_to_add = types.filter(t => !(result.includes(t)));
        await trx(discount_condition_type.name).insert(types_to_add.map(t => {
            return {
                discount_condition_type_id: t
            }
        }))
    })
        .then(success)
        .catch(new_err => handler('addDiscountConditionType', new_err, _addDiscountConditionType, types, attempts))

export const ClearDB = async (): Promise<void> => {
    let builder = getBuilder();
    const dropRequests = config.reduceRight((acc, table) => acc.concat([builder.dropTableIfExists(table.name)]), []);
    await dropRequests[0]
};

export const AddPurchaseTypeToShop = (shop_id: number, purchase_type: number): Promise<boolean> => _AddPurchaseTypeToShop([shop_id, purchase_type], 3)

const _AddPurchaseTypeToShop = ([shop_id, purchase_type]: [number, number], attempts: number): Promise<boolean> =>
    getDB().transaction((trx: any) =>
        trx(available.name).insert({shop_id: shop_id, purchase_type_id: purchase_type})
    )
        .then(success)
        .catch(new_err => handler('AddPurchaseTypeToShop', new_err, _AddPurchaseTypeToShop, [shop_id, purchase_type], attempts))

export const RemovePurchaseTypeFromShop = (shop_id: number, purchase_type: number): Promise<boolean> =>
    _RemovePurchaseTypeFromShop([shop_id, purchase_type], 3)

const _RemovePurchaseTypeFromShop = ([shop_id, purchase_type]: [number, number], attempts: number): Promise<boolean> =>
    getDB().transaction((trx: any) =>
        trx(available.name).where({shop_id: shop_id, purchase_type_id: purchase_type}).del()
    )
        .then(success)
        .catch(new_err => handler('RemovePurchaseTypeFromShop', new_err, _RemovePurchaseTypeFromShop, [shop_id, purchase_type], attempts))

export const AddOffer = (user_id: number, shop_id: number, offer_id: number, product_id: number, amount: number, price_per_unit: number) =>
    _AddOffer([user_id, shop_id, offer_id, product_id, amount, price_per_unit], 3)

const _AddOffer = ([user_id, shop_id, offer_id, product_id, amount, price_per_unit]: [number, number, number, number, number, number], attempts: number) =>
    getDB().transaction(async (trx: any) => {
        await trx(offer.name).insert({
            user_id: user_id,
            product_id: product_id,
            shop_id: shop_id,
            offer_id: offer_id,
            isCounterOffer: 0, // false
            amount: amount,
            price_per_unit: price_per_unit,
        })
        const entries_to_add = await trx
            .select(
                trx.raw(`${offer_id} as offer_id`),
                user.pk).
            from({
                A:trx.select(user.pk).from(manages.name).where({shop_id: shop_id})
                    .union(trx.select(user.pk).from(owns.name).where({shop_id: shop_id}))
                    .union(trx.select(user.pk).from(shop.name).where({shop_id: shop_id}))
            })
        await trx(offer_not_accepted_by.name).insert(entries_to_add.map(e => ({offer_id: e.offer_id, user_id: e.user_id})))
    })
        .then(success)
        .catch(new_err => handler('AddOffer', new_err, _AddOffer, [user_id, shop_id, offer_id, product_id, amount, price_per_unit], attempts))

export const OfferAcceptedByManagement = (user_id: number, offer_id: number): Promise<boolean> => _OfferAcceptedByManagement([user_id, offer_id], 3)

const _OfferAcceptedByManagement = ([user_id, offer_id]: [number, number], attempts: number): Promise<boolean> =>
    getDB().transaction((trx: any) =>
        trx(offer_not_accepted_by.name).where({user_id: user_id, offer_id: offer_id}).del()
    )
        .then(success)
        .catch(new_err => handler('OfferAcceptedByManagement', new_err, _OfferAcceptedByManagement, [user_id, offer_id], attempts))

export const RemoveOffer = (offer_id: number): Promise<boolean> => _RemoveOffer(offer_id, 3)

const _RemoveOffer = (offer_id: number, attempts: number): Promise<boolean> =>
    getDB().transaction((trx: any) =>
        trx(offer.name).where({offer_id: offer_id}).del()
    )
        .then(success)
        .catch(new_err => handler('RemoveOffer', new_err, _RemoveOffer, offer_id, attempts))

export const CounterOffer = (offer_id: number, user_id: number, new_price_per_unit: number): Promise<boolean> => _CounterOffer([offer_id, user_id, new_price_per_unit], 3)

const _CounterOffer = ([offer_id, user_id, new_price_per_unit]: [number, number, number], attempts: number): Promise<boolean> =>
    getDB().transaction(async (trx: any) => {
        const shop_id = (await trx.select(shop.pk).from(offer.name).where({offer_id: offer_id}))[0].shop_id;
        let all_management = (await trx
            .select(
                trx.raw(`${offer_id} as offer_id`),
                user.pk).
            from({
                A: trx.select(user.pk).from(manages.name).where({shop_id: shop_id})
                    .union(trx.select(user.pk).from(owns.name).where({shop_id: shop_id}))
                    .union(trx.select(user.pk).from(shop.name).where({shop_id: shop_id}))
            }))
            .filter(m => m.user_id != user_id)
            .map(m => ({user_id: m.user_id, offer_id: m.offer_id}))
        await trx(offer_not_accepted_by.name).where({offer_id: offer_id}).del()
        if(all_management.length > 0){
            await trx(offer_not_accepted_by.name).insert(all_management)
        }
        await trx(offer.name).where({offer_id: offer_id}).update({isCounterOffer: 1,  price_per_unit: new_price_per_unit})
    })
        .then(success)
        .catch(new_err => handler('CounterOffer', new_err, _CounterOffer, [offer_id, user_id, new_price_per_unit], attempts))

export const RemoveNotificationsByPrefix = (prefix: string): Promise<boolean> => _RemoveNotificationsByPrefix(prefix, 3)

const _RemoveNotificationsByPrefix = (prefix: string, attempts: number): Promise<boolean> =>
    getDB().transaction((trx: any) =>
        trx(notification.name).where(trx.raw(`notification like '${prefix}%'`)).del()
    )
        .then(success)
        .catch(new_err => handler('RemoveNotificationsByPrefix', new_err, _RemoveNotificationsByPrefix, prefix, attempts))
