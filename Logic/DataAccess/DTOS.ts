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
    name: string,
    base_price: number,
    description: string,
    categories: string,
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
    notification_id: number,
    notification: string,
}

export type Permission = number

export type Rate = {
    user_id: number,
    product_id: number,
    rate: number,
}

export type PurchaseSimpleCondition = {
    value: string,
    purchase_condition: number,
}

export const isPurchaseSimpleCondition = (x: any): x is PurchaseSimpleCondition => typeof x.purchase_condition == 'number';

export type PurchaseCompositeCondition = {
    first_policy: number,
    second_policy: number,
    operator: number,
}

export const isPurchaseCompositeCondition = (x: any): x is PurchaseCompositeCondition => typeof x.operator == 'number';

export type DiscountSimpleCondition = number

export const isDiscountSimpleCondition = (x: any): x is DiscountSimpleCondition => typeof x == 'number';

export type DiscountCompositeCondition = {
    first_policy: number,
    second_policy: number,
    operator: number,
}

export const isDiscountCompositeCondition = (x: any): x is DiscountCompositeCondition => typeof x.operator == 'number';

export type DiscountConditionalCondition = {
    discount_param: string,
    discount_condition: number,
    operand_discount: number,
}

export const isDiscountConditionalCondition = (x: any): x is DiscountConditionalCondition => typeof x.discount_condition == 'number';

