import {db} from './DB.config';

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
export type User = {
    user_id: number,
    email: string,
    password: string,
    age: number,
    admin: boolean,
    purchases_ids: number[],
    cart: {
        shop_id: number,
        product_id: number,
        amount: number
    }[],
}
export const GetUsers = (): Promise<User[]> =>
    db.transaction((trx: any) =>
        trx.select().from(user.name)
            .then((users: any[]) =>
                Promise.all(
                    users.map(async (u: any): Promise<User> => {
                    const purchases = await trx.select().from(purchase.name).where(user.pk, u.user_id)
                    const baskets = await trx.select().from(basket.name).where(user.pk, u.user_id)
                    return {
                        user_id: u.user_id,
                        email: u.email,
                        password: u.password,
                        age: u.age,
                        admin: u.admin == 1,
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

export type ShopRaw = {
    shop_id: number,
    original_owner: number,
    name: string,
    description: string,
    location: string,
    bank_info: string,
    active: boolean,
}

export const GetShopsRaw = (): Promise<ShopRaw[]> =>
    db.transaction((trx: any): Promise<ShopRaw[]> =>
        trx.select().from(shop.name)
            .then((shops: any[]) =>
                shops.map((s: any): ShopRaw => {
                    return {
                        shop_id: s.shop_id,
                        original_owner: s.user_id,
                        name: s.name,
                        description: s.description,
                        location: s.location,
                        bank_info: s.bank_info,
                        active: s.active == 1,
                    }
                })
            )
    )

export type Manager = {
    manager_id: number,
    appointer_id: number,
    permissions: number[],
}

export const groupByManagers = (managers: any[]): Manager[] =>{
    managers.sort((first: any, second: any) => first.manager_id - second.manager_id)
    let output: Manager[] = [];
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

export type ShopManagement = {
    shop_id: number,
    owners: {
        owner_id: number,
        appointer_id: number,
    }[],
    managers: Manager[]
}

export const GetShopsManagement = (): Promise<ShopManagement[]> =>
    db.transaction(async (trx: any): Promise<ShopManagement[]> => {
            const shops = await trx.select(shop.pk).from(shop.name);
            const owners = (await trx.raw(`SELECT * FROM 
                           (SELECT ${shop.pk} FROM ${shop.name}) as A INNER JOIN ${owns.name} ON A.${shop.pk} = ${owns.name}.${shop.pk}`))[0]
            const managers = (await trx.raw(`SELECT * FROM 
                        (SELECT ${shop.pk} FROM ${shop.name}) as A INNER JOIN ${manages.name} ON A.${shop.pk} = ${manages.name}.${shop.pk}`))[0]
            return shops.map((s: any): ShopManagement => {
                return {
                    shop_id: s.shop_id,
                    owners: owners.filter((o: any) => o.shop_id == s.shop_id).map(o => {
                        return {
                            owner_id: o.user_id,
                            appointer_id: o.appointer_id,
                        }
                    }),
                    managers: groupByManagers(managers.filter((m: any) => m.shop_id == s.shop_id).map((m: any) => {
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

export type PurchaseConditionTree = {
    id: any,
    value?: number,
    type?: number,
    operator?: number,
    left?: any,
    right?: any
}
export const GetPurchaseConditions = (policy_id: number): Promise<PurchaseConditionTree> =>{
    return db.transactioan(async (trx: any) => {
        const query = (id: number) => trx.raw(`(SELECT simple_id as first, -1 as second FROM purchase_simple_condition where simple_id = ${id}) union
            (SELECT first, second FROM
                (SELECT composite_id as p_condition_id FROM purchase_composite_condition WHERE composite_id = ${id}) as Com INNER JOIN purchase_comprised
                on purchase_comprised.composite_id = Com.p_condition_id)`)
        const getType = (id: number) =>
            trx.raw(`SELECT type_id FROM ${purchase_simple_condition_type_of.name} WHERE ${purchase_simple_condition.pk} = ${id}`)
        const getValue = (id: number) =>
            trx.raw(`SELECT value FROM ${purchase_simple_condition.name} WHERE ${purchase_simple_condition.pk} = ${id}`)
        const getOperator = (id: number) =>
            trx.raw(`SELECT operator_id FROM ${purchase_comprised.name} WHERE ${purchase_composite_condition.pk} = ${id}`)
        const f = async (pid: number): Promise<PurchaseConditionTree> =>{
            let res = (await query(pid))[0];
            if(res[0].first >= 0 && res[0].second >= 0){
                const operator = (await getOperator(pid))[0][0];
                const left = await f(res[0].first);
                const right = await f(res[0].second);
                return {
                    id: pid,
                    operator: operator.operator_id,
                    left: left,
                    right: right
                }
            } else {
                const type = (await getType(pid))[0][0];
                const value = (await getValue(pid))[0][0];
                return {
                    id: pid,
                    value: value.value,
                    type: type.type_id
                }
            }
        }
        return f(policy_id);
    })
}

export type DiscountTree = {
    id: any,
    param?: any,
    type?:any,
    value?: any,
    operator?:any,
    left?: any,
    right?: any
}
export const GetDiscount = (policy_id: number): Promise<DiscountTree> =>{
    return db.transaction( async (trx: any) =>{
        const query = (id: number) => trx.raw(`(SELECT discount_id as first, -1 as second FROM discount_simple where discount_id = ${id}) union
            (SELECT first, second FROM
                (SELECT discount_composite_id as discount_id FROM discount_composite WHERE discount_composite_id = ${id}) as Com INNER JOIN discount_comprised_composite
                on discount_comprised_composite.discount_composite_id = Com.discount_id) UNION
            (SELECT discount_id as first, -2 as second FROM
                (SELECT discount_conditional_id FROM discount_conditional WHERE discount_conditional_id = ${id}) as Com INNER JOIN discount_comprised_conditional
                on discount_comprised_conditional.discount_conditional_id = Com.discount_conditional_id)`)
        const getType = (id: number) =>
            trx.raw(`SELECT ${discount_condition_type.pk} FROM ${discount_conditional_type_of.name} WHERE ${discount_conditional.pk} = ${id}`)
        const getValue = (id: number) =>
            trx.raw(`SELECT value FROM ${discount_simple.name} WHERE ${discount.pk} = ${id}`)
        const getOperator = (id: number) =>
            trx.raw(`SELECT ${discount_operator.pk} FROM ${discount_comprised_composite.name} WHERE ${discount_composite.pk} = ${id}`)
        const getParam = (id: number) =>
            trx.raw(`SELECT discount_param FROM ${discount_conditional.name} WHERE ${discount_conditional.pk} = ${id}`)
        const f = async (did: number): Promise<DiscountTree> =>{
            let res = (await query(did))[0];
            if(res[0].first >= 0 && res[0].second >= 0){
                const operator = (await getOperator(did))[0][0];
                const left = await f(res[0].first);
                const right = await f(res[0].second);
                return {
                    id: did,
                    left: left,
                    right: right,
                    operator: operator.discount_operator_id,
                }
            } else if(res[0].second == -2) {
                const left = await f(res[0].first);
                const type = (await getType(did))[0][0];
                const param = (await getParam(did))[0][0];
                return {
                    id: did,
                    left: left,
                    param: param.discount_param,
                    type: type.discount_condition_type_id
                }
            } else {
                const value = (await getValue(did))[0][0];
                return {
                    id: did,
                    value: value.value
                }
            }
        }
        return f(policy_id);
    })
}

export type ProductData = {
    data: {
        product_id: number,
        purchase_type: number,
        name: string,
        amount: number,
        base_price: number,
        description: string,
        categories: string,
    },
    rates: {
        user_email: string,
        score: number,
    }[],
}
export type ShopRich = {
    shop_id: number,
    products: ProductData[],
    purchase_conditions: number[],
    discounts: number[],
    purchase_types: number[]
};

export const groupByShops = (shops: any[]): ShopRich[]  =>{
    shops.sort((first: any, second: any) => first.shop_id - second.shop_id)
    let output: ShopRich[] = [];
    let flag = -1;
    for (let i = 0; i < shops.length; i++) {
        if (flag == shops[i].shop_id) {
            if (shops[i].p_condition_id != undefined){
                // @ts-ignore
                output[output.length - 1].purchase_conditions.push(shops[i].p_condition_id)
            } else if(shops[i].discount_id != undefined){
                // @ts-ignore
                output[output.length - 1].discounts.push(shops[i].discount_id)
            } else if(shops[i].purchase_type_id != undefined) {
                output[output.length - 1].purchase_types.push(shops[i].purchase_type_id)
            } else {
                output[output.length - 1].products.push(shops[i].product)
            }
        } else {
            flag = shops[i].shop_id;
            if (shops[i].p_condition_id != undefined){
                output.push({
                    shop_id: shops[i].shop_id,
                    products: [],
                    purchase_conditions: [shops[i].p_condition_id],
                    discounts: [],
                    purchase_types: [],
                })
            } else if(shops[i].discount_id != undefined){
                output.push({
                    shop_id: shops[i].shop_id,
                    products: [],
                    purchase_conditions: [],
                    discounts: [shops[i].discount_id],
                    purchase_types: [],
                })
            } else if(shops[i].purchase_type_id != undefined){
                output.push({
                    shop_id: shops[i].shop_id,
                    products: [],
                    purchase_conditions: [],
                    discounts: [],
                    purchase_types: [shops[i].purchase_type_id],
                })
            } else {
                output.push({
                    shop_id: shops[i].shop_id,
                    products: [shops[i].product],
                    purchase_conditions: [],
                    discounts: [],
                    purchase_types: [],
                })
            }
        }
    }
    return output;
}

const groupByProduct = (products: any[]): {shop_id: number, product: ProductData }[] => {
    products.sort((first: any, second: any) => first.product_id - second.product_id)
    let flag = -1;
    let output: {shop_id: number, product: ProductData }[] = []
    for (let i = 0; i < products.length; i++) {
        if (flag != products[i].product_id) {
            flag = products[i].product_id;
            output.push({
                shop_id: products[i].shop_id,
                product: {
                    data: {
                        product_id: products[i].product_id,
                        purchase_type: products[i].purchase_type,
                        name: products[i].name,
                        amount: products[i].amount,
                        base_price: products[i].base_price,
                        description: products[i].description,
                        categories: products[i].categories,
                    },
                    rates: []
                }
            })
        }
        if (products[i].rate != null){
            output[output.length - 1].product.rates.push({
                score: products[i].rate,
                user_email: products[i].email,
            })
        }
    }
    return output;
}

//TODO test add product, update product and get shops inventory
export const GetShopsInventory = (): Promise<ShopRich[]> =>
    db.transaction(async (trx: any): Promise<ShopRich[]> => {
        const purchase_types = await trx.select().from(available.name);
        const products = await
            trx.select().from({
                B: trx.select('p_id', 'email', 'rate')
                    .from({A: trx(rates.name).select('p_id', 'rate', trx.ref('user_id').as('u_id'))})
                    .innerJoin(user.name, `${user.name}.${user.pk}`, `A.u_id`)
            }).rightOuterJoin(product.name, `${product.name}.${product.pk}`, `B.p_id`)
        const sortedProducts = groupByProduct(products);
        const purchaseConditions = await trx.select().from(purchase_condition_allowed_in.name);
        const discounts = await trx.select().from(discount_allowed_in.name);
        return groupByShops(purchaseConditions.concat(discounts).concat(sortedProducts).concat(purchase_types))
    })

export const GetNotifications = () =>
    db.transaction(async (trx: any) =>
        trx.select().from(notification.name))

export type ProductPurchase = {
    product_id: number,
    name: string,
    categories: string,
    description: string,
    base_price: number,
    amount: number,
    actual_price: number,
}
export type Purchase = {
    user_id: number,
    shop_id: number,
    purchase_id: number,
    products: ProductPurchase[]
    date: Date,
}
const groupByPurchases = (purchases: any[]): Purchase[] => {
    let output: Purchase[] = []
    purchases.sort((first: any, second: any) => first.purchase_id - second.purchase_id)
    let flag = -1;
    for (let i = 0; i < purchases.length; i++) {
        if(flag != purchases[i].purchase_id){
            flag = purchases[i].purchase_id;
            output.push({
                date: new Date(purchases[i].timestamp),
                purchase_id: purchases[i].purchase_id,
                shop_id: purchases[i].shop_id,
                user_id: purchases[i].user,
                products: []
            })
        }
        output[output.length - 1].products.push({
            product_id: purchases[i].product_id,
            actual_price: purchases[i].actual_price,
            amount: purchases[i].amount,
            base_price: purchases[i].base_price,
            categories: purchases[i].categories,
            description: purchases[i].description,
            name: purchases[i].name
        })
    }
    return output;
}

export const GetPurchases = (): Promise<Purchase[]> =>
    db.transaction((trx: any): Promise<Purchase[]> =>
        trx.select().from(purchase.name)
            .then((purchases: any[]) => groupByPurchases(purchases)))
