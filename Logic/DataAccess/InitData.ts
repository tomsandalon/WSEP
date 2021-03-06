import {connectToDB} from './DB.config';
import {
    AddDiscount, addDiscountConditionType,
    addDiscountOperator,
    AddItemToBasket, AddOffer,
    addPermissions,
    AddProduct,
    addPurchaseConditionOperator,
    addPurchaseConditionType,
    AddPurchasePolicy,
    addPurchaseTypes, AddPurchaseTypeToShop,
    AddShop,
    AppointManager,
    AppointOwner, CounterOffer, CreateAdminIfNotExist, OfferAcceptedByManagement,
    PurchaseBasket,
    RateProduct,
    RegisterUser,
    RemainingManagement,
    removeDiscount,
    RemoveManager, RemoveNotificationsByPrefix, RemoveOffer,
    removePurchasePolicy, RemovePurchaseTypeFromShop,
    UpdatePermissions
} from "./API";
import {
    GetDiscount, GetNotifications,
    GetPurchaseConditions, GetPurchases,
    GetShopsInventory,
    GetShopsManagement,
    GetShopsRaw,
    GetUsers,
    groupByManagers
} from "./Getters";
import {purchase_cart} from "../Communication/Config/Config";
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
    admin: true
};
const four_user = {
    user_id: 4,
    email: "lior@gmail.com",
    password: "1234",
    age: 25,
};
const five_user = {
    user_id: 5,
    email: "nicol@gmail.com",
    password: "1234",
    age: 18,
};
const first_shop = {
    shop_id: 1,
    user_id: first_user.user_id,
    name: "Raeython",
    description: "Aerospace",
    location: "USA",
    bank_info: "USA 4 ever",
    active: true,
    purchase_type: [1]
};
const first_product = {
    product_id: 1,
    shop_id: first_shop.shop_id,
    purchase_type: first_purchase_type,
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
            RegisterUser(four_user))
        .then((_: any) =>
            RegisterUser(five_user))
        .then((_: any) =>
            addPurchaseTypes([1,2,3,4]))
        .then((_: any) =>
            addPurchaseConditionType([1,2,3,4]))
        .then((_: any) =>
            addPurchaseConditionOperator([1,2,3,4]))
        .then((_: any) =>
            addDiscountConditionType([1,2,4]))
        .then((_: any) =>
            addDiscountOperator([1,2,3]))
        .then((_: any) => addPermissions([1,2,3]))
        .then((_: any) =>
            AddShop(first_shop))
        .then((_: any) => AddProduct(first_product))
        .then((_: any) => AddItemToBasket({
            user_id: third_user.user_id,
            shop_id: first_shop.shop_id,
            product_id: first_product.product_id,
            amount: 20
        }))
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
            value: "444",
            purchase_condition: first_purchase_condition_type
        }))
        .then((_: any) => AddPurchasePolicy(first_shop.shop_id, 5, {
            value: "555",
            purchase_condition: first_purchase_condition_type
        }))
        .then((_: any) => AddPurchasePolicy(first_shop.shop_id, 6, {
            first_policy: 1,
            second_policy: 2,
            operator: first_purchase_condition_operator,
        }))
        .then((_: any) => AddPurchasePolicy(first_shop.shop_id, 7, {
            first_policy: 3,
            second_policy: 6,
            operator: first_purchase_condition_operator,
        }))
        .then((_: any) => AddPurchasePolicy(first_shop.shop_id, 8, {
            first_policy: 4,
            second_policy: 5,
            operator: first_purchase_condition_operator,
        }))
        .then((_: any) => AddPurchasePolicy(first_shop.shop_id, 9, {
            first_policy: 8,
            second_policy: 7,
            operator: first_purchase_condition_operator,
        }))
        .then((_: any) => AddPurchasePolicy(first_shop.shop_id, 10, {
            value: "1010",
            purchase_condition: first_purchase_condition_type
        }))
        .then((_: any) => AddDiscount(first_shop.shop_id, 1, 111))
        .then((_: any) => AddDiscount(first_shop.shop_id, 2, 222))
        .then((_: any) => AddDiscount(first_shop.shop_id, 3, 333))
        .then((_: any) => AddDiscount(first_shop.shop_id, 4, 444))
        .then((_: any) => AddDiscount(first_shop.shop_id, 5, 555))
        .then((_: any) => AddDiscount(first_shop.shop_id, 6, 666))
        .then((_: any) => AddDiscount(first_shop.shop_id, 7, {
                    first_policy: 1,
                    second_policy: 2,
                    operator: first_discount_operator
                }))
        .then((_: any) => AddDiscount(first_shop.shop_id, 8, {
                discount_param: "banana",
                discount_condition: first_discount_condition_type,
                operand_discount: 3,
            }))
        .then((_: any) => AddDiscount(first_shop.shop_id, 9, {
            first_policy: 8,
            second_policy: 7,
            operator: first_discount_operator
        }))
        .then((_: any) => AppointOwner(third_user.email, first_user.email, first_shop.shop_id,))
        .then((_: any) => AppointOwner(four_user.email, first_user.email, first_shop.shop_id,))
        .then((_: any) => AppointOwner(five_user.email, first_user.email, first_shop.shop_id,))

// RemoveManager(second_user.email, first_shop.shop_id)
// AppointManager(second_user.email, first_user.email, first_shop.shop_id, [first_perm, second_perm])

// removeDiscount(first_shop.shop_id, 9)

// PurchaseBasket(third_user.user_id, first_shop.shop_id, 1, new Date(), [{
//             product_id: first_product.product_id,
//             amount: 20,
//             actual_price: 14,
//             name: first_product.name,
//             base_price: first_product.base_price,
//             description: first_product.description,
//             categories: first_product.categories,
//         }
//     ])
// addPurchaseTypes([1,2,3,4,5])
//     .then(_ => addPermissionsDB([1,2,3,4,5]))
//     .then(_ => addPurchaseConditionType([1,2,3,4,5]))
//     .then(_ => addPurchaseConditionOperator([1,2,3,4,5]))
//     .then(_ => addDiscountOperator([1,2,3,4,5]))
//     .then(_ => addDiscountConditionType([1,2,3,4,5]))
//     .then((result: any) => console.log(`Finish`))

// AddProduct(first_product)
//         .then((result: any) => console.log(`Finish ${result}`))
connectToDB();

AddPurchaseTypeToShop(1, 22)
    .then((result: any) => console.log(`Finish ${result}`))

// RemovePurchaseTypeFromShop(1, 1)
//     .then((result: any) => console.log(`Finish ${result}`))

// OfferAcceptedByManagement(4, 88)
//     .then((result: any) => console.log(`Finish ${result}`))

// AddOffer(1, 1, 120, 1, 120, 55)
//     .then((result: any) => console.log(`Finish ${result}`))

// RemoveOffer(99)
//     .then((result: any) => console.log(`Finish ${result}`))

// CounterOffer(88, 3, 120)
//     .then((result: any) => console.log(`Finish ${result}`))

// RemoveNotificationsByPrefix('Off 1')
//     .then((result: any) => console.log(`Finish ${result}`))


// initData().then((result: any) => console.log(`Finish ${result}`))