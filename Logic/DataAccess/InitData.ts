import {db} from './DB.config';
import {
    AddDiscount, AddDiscountConditionType, AddDiscountOperator,
    AddPermission,
    AddProduct, AddPurchaseConditionOperator, AddPurchaseConditionType, AddPurchasePolicy,
    AddPurchaseType,
    AddShop,
    AppointManager,
    AppointOwner,
    RegisterUser,
    RemoveManager, UpdatePermissions
} from "./API";
const first_purchase_type = 1;
const first_purchase_condition_type = 1;
const first_purchase_condition_operator = 1;
const first_discount_condition_type = 1;
const first_discount_operator = 1;
const first_perm = 1;
const second_perm = 2;
const third_perm = 3;
const first_user = {
    user_id: 1,
    email: "mark@gmail.com",
    password: "1234",
    age: 21,
};
const second_user = {
    user_id: 2,
    email: "tom@gmail.com",
    password: "1234",
    age: 26,
};
const third_user = {
    user_id: 3,
    email: "tomer@gmail.com",
    password: "1234",
    age: 25,
};
const first_shop = {
    shop_id: 1,
    user_id: first_user.user_id,
    name: "Raeython",
    description: "Aerospace",
    location: "USA",
    bank_info: "USA 4 ever",
    active: true,
};
const first_product = {
    product_id: 1,
    shop_id: first_shop.shop_id,
    purchase_type_id: first_purchase_type,
    name: "Patriot",
    amount: 1000,
    base_price: 4000,
    description: "High precision surface to air missile",
    categories: "Anti-ballistic missile system",
};
export const initData = () =>
    RegisterUser(first_user)
        .then((_: any) =>
            RegisterUser(second_user))
        .then((_: any) =>
            RegisterUser(third_user))
        .then((_: any) =>
            AddPurchaseType(first_purchase_type))
        .then((_: any) =>
            AddPurchaseConditionType(first_purchase_condition_type))
        .then((_: any) =>
            AddPurchaseConditionOperator(first_purchase_condition_operator))
        .then((_: any) =>
            AddDiscountConditionType(first_discount_condition_type))
        .then((_: any) =>
            AddDiscountOperator(first_discount_operator))
        .then((_: any) => AddPermission(first_perm))
        .then((_: any) => AddPermission(second_perm))
        .then((_: any) => AddPermission(third_perm))
        .then((_: any) =>
            AddShop(first_shop))
        .then((_: any) => AddProduct(first_product))
        .then((_: any) => AppointManager(second_user.email, first_user.email, first_shop.shop_id, [first_perm, second_perm]))
        .then((_: any) => AddPurchasePolicy(first_shop.shop_id, 1, {
            value: "VVV",
            purchase_condition: first_purchase_condition_type
        }))
        .then((_: any) => AddPurchasePolicy(first_shop.shop_id, 2, {
            value: "abb",
            purchase_condition: first_purchase_condition_type
        }))
        .then((_: any) => AddPurchasePolicy(first_shop.shop_id, 3, {
            value: "ccc",
            purchase_condition: first_purchase_condition_type
        }))
        .then((_: any) => AddPurchasePolicy(first_shop.shop_id, 4, {
            first_policy: 1,
            second_policy: 2,
            operator: first_purchase_condition_operator,
        }))
        // .then((_: any) => AppointOwner(third_user.email, first_user.email, first_shop.shop_id,))

// RemoveManager(second_user.email, first_shop.shop_id)
// AppointManager(second_user.email, first_user.email, first_shop.shop_id, [first_perm, second_perm])
// AddPurchasePolicy(first_shop.shop_id, 4, {
//     first_policy: 1,
//     second_policy: 2,
//     operator: first_purchase_condition_operator,
// })
//     .then((result: any) => console.log(`Finish ${JSON.stringify(result)}`))

initData().then((result: any) => console.log(`Finish ${result}`))