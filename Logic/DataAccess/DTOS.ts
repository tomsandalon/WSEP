const {db} = require('./DB.config');
const {user} = require("./Tables");

export type User = {
    user_id: number,
    email: string,
    password: string,
    age: number,
}

export type Shop = {
    shop_id: number,
    user_id: number,
    name: string,
    description: string,
    location: string,
    bank_info: string,
    active: boolean,
}

export type Product = {
    product_id: number,
    shop_id: number,
    purchase_type: number,
    name: string,
    amount: number,
    base_price: number,
    description: string,
    categories: string,
}

export type Purchase = {
    product_id: number,
    amount: number,
    actual_price: number,
}

export type Basket = {
    user_id: number,
    shop_id: number,
    product_id: number,
    amount: number,
}

export type Offer = {
    user_id: number,
    product_id: number,
    shop_id: number,
    amount: number,
    price_per_unit: number,
}

export type Notification = {
    user_id: number,
    notification: string,
}

export type Permission = number

export type Rate = {
    user_id: number,
    product_id: number,
    rate: string,
}

export type PurchaseSimpleCondition = {
    value: string,
    purchase_condition: number,
}

export type PurchaseCompositeCondition = {
    first_policy: number,
    second_policy: number,
    operator: number,
}

export type DiscountSimpleCondition = number

export type DiscountCompositeCondition = {
    first_policy: number,
    second_policy: number,
    operator: number,
}

export type DiscountConditionalCondition = {
    discount_param: string,
    discount_condition: number,
    operand_discount: number,
}


