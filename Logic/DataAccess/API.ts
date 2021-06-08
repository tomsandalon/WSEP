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
const {getDB, connectToDB} = require('./DB.config')

const success = (_: any) => true;
const failure = async (err: any, f: TryAgain, input: any, currAttempt: number) => {
    // console.log(err)
    // console.log('Retrying' + JSON.stringify(input, null, 2))
    if(currAttempt > 0){
        await f(input, currAttempt - 1)
    } else {
        // console.log('Failure')
    }
    return false;
}

const handler = (err, f, data, attempts) =>
    failure(err, f, data, attempts)
        .then(x => x).catch(new_err => handler(new_err, f, data, attempts))

const returnFalse = (err: any) => {
    console.log(err)
    return false;
}
type TryAgain = (_: any, attemps: number) => any
export const AddPermission = (perm: Permission) =>
    getDB().transaction((trx: any) =>
        trx.insert({permission_id: perm}).into(permission.name)
            .then(success)
            .catch(returnFalse)
    )

export const AddPurchaseConditionOperator = (operator: number) =>
    getDB().transaction((trx: any) =>
        trx.insert({operator_id: operator}).into(purchase_condition_operator.name)
            .then(success)
            .catch(returnFalse)
    )

export const AddPurchaseConditionType = (type: number) =>
    getDB().transaction((trx: any) =>
        trx.insert({type_id: type}).into(purchase_condition_type.name)
            .then(success)
            .catch(returnFalse)
    )

export const AddDiscountOperator = (operator: number) =>
    getDB().transaction((trx: any) =>
        trx.insert({discount_operator_id: operator}).into(discount_operator.name)
            .then(success)
            .catch(returnFalse)
    )

export const AddDiscountConditionType = (type: number) =>
    getDB().transaction((trx: any) =>
        trx.insert({discount_condition_type_id: type}).into(discount_condition_type.name)
            .then(success)
            .catch(returnFalse)
    )

export const AddPurchaseType = (type: number) =>
    getDB().transaction((trx: any) =>
        trx.insert({purchase_type_id: type}).into(purchase_type.name)
            .then(success)
            .catch(returnFalse)
    )
export const RegisterUser = (data: User) => {
    // console.log(`Date ${JSON.stringify(data, null, 2)}`)
    return getDB().transaction((trx: any) =>
        trx.insert({
            user_id: data.user_id,
            email: data.email,
            password: data.password,
            age: data.age,
            admin: data.admin,
        }).into(user.name)
            .then(success)
            .catch(returnFalse)
    )
}

export const ConnectToDB = (): Promise<boolean> => {
    connectToDB()
    return new Promise<boolean>(() => 1 == 1)
}

export const CreateAdminIfNotExist = (user_id: number, user_email: string, hashed_pass: string, age: number): Promise<void> => {
    return new Promise<void>(() => {
    })
}

export const AddShop = (data: Shop) => {
    // console.log(`Add shop ${data.shop_id} -- ${typeof data.shop_id}`)
    return _AddShop(data, 3)
}

const _AddShop = (data: Shop, attempts: number) =>
    getDB().transaction((trx: any) =>
        trx.insert(data).into(shop.name)
    )
        .then(success)
        .catch(new_err => handler(new_err, _AddShop, data, attempts))

export const AddItemToBasket = (data: Basket) => _AddItemToBasket(data, 3)

const _AddItemToBasket = (data: Basket, attempts: number) =>
    getDB().transaction((trx: any) =>
        trx.insert(data).into(basket.name)
    )
        .then(success)
        .catch(new_err => handler(new_err, _AddItemToBasket, data, attempts))

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
        .catch(new_err => handler(new_err, _UpdateItemInBasket, data, attempts))

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
        .catch(new_err => handler(new_err, _DeleteItemInBasket, data, attempts))

export const AddProduct = (data: Product) =>{
    // console.log(`data ${JSON.stringify(data, null, 2)}`)
    return _AddProduct(data, 3)
}

const _AddProduct: TryAgain = (data: Product, attempts: number) =>{
    return getDB().transaction((trx: any) =>
        trx.insert(data).into(product.name)
            )
        .then(success).catch(new_err => handler(new_err, _AddProduct, data, attempts))
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
        .catch(new_err => handler(new_err, _UpdateProduct, data, attempts))


export const RemoveProduct = (product_id: number) => _RemoveProduct(product_id, 3)

const _RemoveProduct = (product_id: number, attempts: number) =>
    getDB()(product.name)
        .where({
            product_id: product_id,
        })
        .del()
        .then(success)
        .catch(new_err => handler(new_err, _RemoveProduct, product_id, attempts))

export const AppointManager = (target_email: string, appointer_email: string, shop_id: number, permissions: Permission[]) =>
    _AppointManager([target_email, appointer_email, shop_id, permissions], 3)

const _AppointManager = ([target_email, appointer_email, shop_id, permissions]: [string, string, number, Permission[]], attempts: number) =>
    getDB().transaction((trx: any) =>
            Promise.all(permissions.map((perm) =>
                trx(manages.name).insert({
                    shop_id: shop_id,
                    permission_id: perm,
                    user_id: trx.raw("(SELECT user_id FROM user WHERE email = ?)", [target_email]),
                    appointer_id: trx.raw("(SELECT user_id FROM user WHERE email = ?)", [appointer_email])
                })))
    )
        .then(success)
        .catch(new_err => handler(new_err, _AppointManager, [target_email, appointer_email, shop_id, permissions], attempts))

export const AppointOwner = (target_email: string, appointer_email: string, shop_id: number) =>
    _AppointOwner([target_email, appointer_email, shop_id], 3)

const _AppointOwner = ([target_email, appointer_email, shop_id]: [string, string, number], attempts: number) =>
    getDB().transaction((trx: any) =>
        trx(owns.name).insert({
            shop_id: shop_id,
            user_id: trx.raw("(SELECT user_id FROM user WHERE email = ?)", [target_email]),
            appointer_id: trx.raw("(SELECT user_id FROM user WHERE email = ?)", [appointer_email])
        })
    )
        .then(success)
        .catch(new_err => handler(new_err, _AppointOwner, [target_email, appointer_email, shop_id], attempts))

export const RemoveManager = (target_email: string, shop_id: number) =>
    _RemoveManager([target_email, shop_id], 3)

const _RemoveManager = ([target_email, shop_id]: [string, number], attempts: number) =>
    getDB().transaction((trx: any) =>
        trx(manages.name)
            .where({
                shop_id: shop_id,
                user_id: trx.raw("(SELECT user_id FROM user WHERE email = ?)", [target_email])
            })
            .del()
    )
        .then(success)
        .catch(new_err => handler(new_err, _RemoveManager, [target_email, shop_id], attempts))

export const RemainingManagement = (management_emails: string[], shop_id: number) =>
    _RemainingManagement([management_emails, shop_id], 3)

const _RemainingManagement = ([management_emails, shop_id]: [string[], number], attempts: number) =>
    getDB().transaction((trx: any) =>
        trx(owns.name)
            .where({shop_id: shop_id})
            .whereNotIn(user.pk,
                trx(user.name).select(user.pk).whereIn('email', management_emails))
            .del()
    )
        .then(success)
        .catch(new_err => handler(new_err, _RemainingManagement, [management_emails, shop_id], attempts))

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
        .catch(new_err => handler(new_err, _UpdatePermissions, [manager_id, shop_id, new_permissions], attempts))

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
            .catch(new_err => handler(new_err, _AddPurchasePolicy, [shop_id, policy_id, condition], attempts))
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
            .catch(new_err => handler(new_err, _AddPurchasePolicy, [shop_id, policy_id, condition], attempts))

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
            .catch(new_err => handler(new_err, _AddDiscount, [shop_id, discount_id, discount_to_add], attempts))
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
                .catch(new_err => handler(new_err, _AddDiscount, [shop_id, discount_id, discount_to_add], attempts))
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
                .catch(new_err => handler(new_err, _AddDiscount, [shop_id, discount_id, discount_to_add], attempts))

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
        .catch(new_err => handler(new_err, _removeDiscount, [shop_id, discount_id], attempts))
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
        .catch(new_err => handler(new_err, _removePurchasePolicy, [shop_id, policy_id], attempts))
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
        .catch(new_err => handler(new_err, _RateProduct, rate, attempts))

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
        .catch(new_err => handler(new_err, _Notify, notifications, attempts))


export const ClearNotifications = (user_id: number) => _ClearNotifications(user_id, 3)

const _ClearNotifications = (user_id: number, attempts: number) =>
    getDB().transaction((trx: any) =>
        trx(notification.name).where(user.pk, user_id).del()
    )
        .then(success)
        .catch(new_err => handler(new_err, _ClearNotifications, user_id, attempts))

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
                    console.log("for mark " + item.categories)
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
        .catch(new_err => handler(new_err, _PurchaseBasket, [user_id, shop_id, purchase_id, date,  items], attempts))


export const addPurchaseTypes = (types: number[]) =>
    getDB().transaction((trx: any) =>
        trx(purchase_type.name).insert(types.map(t => {
            return {
                purchase_type_id: t
            }
        }))
            .then(success)
            //.catch(failure)
    )

export const addPermissions = (permissions: number[]) =>
    getDB().transaction((trx: any) =>
        trx(permission.name).insert(permissions.map(p => {
            return {
                permission_id: p
            }
        }))
            .then(success)
            //.catch(failure)
    )

export const addPurchaseConditionType = (types: number[]) =>
    getDB().transaction((trx: any) =>
        trx(purchase_condition_type.name).insert(types.map(t => {
            return {
                type_id: t
            }
        }))
            .then(success)
            //.catch(failure)
    )

export const addPurchaseConditionOperator = (operators: number[]) =>
    getDB().transaction((trx: any) =>
        trx(purchase_condition_operator.name).insert(operators.map(o => {
            return {
                operator_id: o
            }
        }))
            .then(success)
            //.catch(failure)
    )

export const addDiscountOperator = (operators: number[]) =>
    getDB().transaction((trx: any) =>
        trx(discount_operator.name).insert(operators.map(o => {
            return {
                discount_operator_id: o
            }
        }))
            .then(success)
            //.catch(failure)
    )

export const addDiscountConditionType = (types: number[]) =>
    getDB().transaction((trx: any) =>
        trx(discount_condition_type.name).insert(types.map(t => {
            return {
                discount_condition_type_id: t
            }
        }))
            .then(success)
            //.catch(failure)
    )

export const ClearDB = (): Promise<boolean> => new Promise(() => true)