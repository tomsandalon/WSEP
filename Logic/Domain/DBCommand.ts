import * as API from "../DataAccess/API"
import {
    Basket,
    DiscountCompositeCondition,
    DiscountConditionalCondition,
    DiscountSimpleCondition,
    Notification,
    Permission,
    Product,
    Purchase,
    PurchaseCompositeCondition,
    PurchaseSimpleCondition,
    Rate,
    Shop,
    User
} from "../DataAccess/DTOS";

let blockDB = false
export const turnBlockDBON = () => blockDB ? Promise.resolve(true) : blockDB = true
export const turnBlockDBOFF = () => blockDB ? Promise.resolve(true) : blockDB = false

export const RegisterUser = (data: User) => blockDB ? Promise.resolve(true) : API.RegisterUser(data)

export const ConnectToDB = async (): Promise<boolean> => blockDB ? Promise.resolve(true) : API.ConnectToDB()

export const CreateAdminIfNotExist = (user_id: number, user_email: string, hashed_pass: string, age: number): Promise<boolean> => blockDB ? Promise.resolve(true) : API.CreateAdminIfNotExist(user_id, user_email, hashed_pass, age)

export const AddItemToBasket = (data: Basket) => blockDB ? Promise.resolve(true) : API.AddItemToBasket(data)

export const UpdateItemInBasket = (data: Basket) => blockDB ? Promise.resolve(true) : API.UpdateItemInBasket(data)

export const DeleteItemInBasket = (data: Basket) => blockDB ? Promise.resolve(true) : API.DeleteItemInBasket(data)

export const AddProduct = (data: Product) => blockDB ? Promise.resolve(true) : API.AddProduct(data)

export const UpdateProduct = (data: Product) => blockDB ? Promise.resolve(true) : API.UpdateProduct(data)

export const RemoveProduct = (product_id: number) => blockDB ? Promise.resolve(true) : API.RemoveProduct(product_id)

export const AppointManager = (target_email: string, appointer_email: string, shop_id: number, permissions: Permission[]) => blockDB ? Promise.resolve(true) : API.AppointManager(target_email, appointer_email, shop_id, permissions)

export const AppointOwner = (target_email: string, appointer_email: string, shop_id: number) => blockDB ? Promise.resolve(true) : API.AppointOwner(target_email, appointer_email, shop_id)

export const RemoveManager = (target_email: string, shop_id: number) => blockDB ? Promise.resolve(true) : API.RemoveManager(target_email, shop_id)

export const RemainingManagement = (management_emails: string[], shop_id: number) => blockDB ? Promise.resolve(true) : API.RemainingManagement(management_emails, shop_id)

export const UpdatePermissions = (manager_id: number, shop_id: number, new_permissions: Permission[]) => blockDB ? Promise.resolve(true) : API.UpdatePermissions(manager_id, shop_id, new_permissions)

export const AddPurchasePolicy = (shop_id: number, policy_id: number, condition: PurchaseSimpleCondition | PurchaseCompositeCondition) => blockDB ? Promise.resolve(true) : API.AddPurchasePolicy(shop_id, policy_id, condition)

export const AddDiscount = (shop_id: number, discount_id: number, discount_to_add: DiscountSimpleCondition | DiscountCompositeCondition | DiscountConditionalCondition) => blockDB ? Promise.resolve(true) :
    API.AddDiscount(shop_id, discount_id, discount_to_add)

export const removeDiscount = (shop_id: number, discount_id: number,) => blockDB ? Promise.resolve(true) : API.removeDiscount(shop_id, discount_id)

export const removePurchasePolicy = (shop_id: number, policy_id: number) => blockDB ? Promise.resolve(true) : API.removePurchasePolicy(shop_id, policy_id)

export const RateProduct = (rate: Rate) => blockDB ? Promise.resolve(true) : API.RateProduct(rate)

export const Notify = (notifications: Notification[]) => blockDB ? Promise.resolve(true) : API.Notify(notifications)

export const ClearNotifications = (user_id: number) => blockDB ? Promise.resolve(true) : API.ClearNotifications(user_id)

export const PurchaseBasket = (user_id: number, shop_id: number, purchase_id: number, date: Date, items: Purchase[]) =>
    blockDB ? Promise.resolve(true) : API.PurchaseBasket(user_id, shop_id, purchase_id, date, items)

export const addPurchaseTypes = (types: number[]) => blockDB ? Promise.resolve(true) : API.addPurchaseTypes(types)

export const addPermissions = (permissions: number[]) => blockDB ? Promise.resolve(true) : API.addPermissions(permissions)

export const addPurchaseConditionType = (types: number[]) => blockDB ? Promise.resolve(true) : API.addPurchaseConditionType(types)

export const addPurchaseConditionOperator = (operators: number[]) => blockDB ? Promise.resolve(true) : API.addPurchaseConditionType(operators)

export const addDiscountOperator = (operators: number[]) => blockDB ? Promise.resolve(true) : API.addDiscountOperator(operators)

export const addDiscountConditionType = (types: number[]) => blockDB ? Promise.resolve(true) : API.addPurchaseConditionType(types)

export const ClearDB = async (): Promise<void> => blockDB ? Promise.resolve() : API.ClearDB()

export const AddPurchaseTypeToShop = (shop_id: number, purchase_type: number): Promise<boolean> => blockDB ? Promise.resolve(true) : API.AddPurchaseTypeToShop(shop_id, purchase_type)

export const RemovePurchaseTypeFromShop = (shop_id: number, purchase_type: number): Promise<boolean> =>
    blockDB ? Promise.resolve(true) : API.RemovePurchaseTypeFromShop(shop_id, purchase_type)

export const AddOffer = (user_id: number, shop_id: number, offer_id: number, product_id: number, amount: number, price_per_unit: number) =>
    blockDB ? Promise.resolve(true) : API.AddOffer(user_id, shop_id, offer_id, product_id, amount, price_per_unit)

export const OfferAcceptedByManagement = (user_id: number, offer_id: number): Promise<boolean> => blockDB ? Promise.resolve(true) :
    API.OfferAcceptedByManagement(user_id, offer_id)

export const RemoveOffer = (offer_id: number): Promise<boolean> => blockDB ? Promise.resolve(true) : API.RemoveOffer(offer_id)

export const CounterOffer = (offer_id: number, user_id: number, new_price_per_unit: number): Promise<boolean> => blockDB ? Promise.resolve(true) :
    API.CounterOffer(offer_id, user_id, new_price_per_unit)

export const RemoveNotificationsByPrefix = (prefix: string): Promise<boolean> => blockDB ? Promise.resolve(true) : API.RemoveNotificationsByPrefix(prefix)

export const AddShop = (data: Shop) => blockDB ? Promise.resolve(true) : API.AddShop(data)
