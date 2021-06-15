import {Service} from "./Service/Service";
import {Purchase_Type} from "./Domain/Shop/ShopInventory";
import {Condition} from "./Domain/Shop/DiscountPolicy/ConditionalDiscount";

const fs = require('fs');
const path = require('path');

const initFileName = 'Init.json'
export const initData = async (service: Service) => {
    const data = JSON.parse(fs.readFileSync(path.join(__dirname, initFileName), 'utf8'));
    const users = createUsers(service, data.users);
    const shops = createShops(service, data.shops, users);
    const products = createProducts(service, data.products, shops);
    return true;
}

const createUsers = (service: Service, users: User[]): {id: number, user: User}[] => {
    let user_ids: {id: number, user: User}[] = [];
    for (const user of users) {
        if (!service.performRegister(user.username, user.password, user.age)){
            console.log('Cannot create user by init file -- ', user.username, user.password)
            return [];
        } else {
            const user_id = service.performLogin(user.username, user.password)
            if (typeof user_id === "string"){
                console.log('Cannot login as user by init file -- ', user.username, user.password)
                return [];
            }
            user_ids.push({
                id: user_id,
                user: user
            });
        }
    }
    return user_ids;
}

const createShops = (service: Service, shops: Shop[], users: {id: number, user: User}[]): {id: number, original_owner_id: number, shop: Shop}[] => {
    let shop_ids: {id: number, original_owner_id: number, shop: Shop}[] = [];
    for (const shop of shops) {
        const original_owner_id = findIdByUser(users, shop.original_owner)
        const shop_id = service.addShop(
            original_owner_id,
            shop.name,
            shop.description,
            shop.location,
            shop.bank_info,
        )
        if (typeof shop_id === "string"){
            console.log('Cannot create shop by init file -- ', shop.name)
            return [];
        } else {
            if (shop.purchase_type === "Offer") {
                if(typeof service.addPurchaseType(original_owner_id, shop_id, Purchase_Type.Offer) === "string"){
                    console.log('Cannot add purchase type to shop by init file -- ', shop_id, shop.name, shop.purchase_type)
                    return [];
                }
            }
            shop_ids.push({
                id: shop_id,
                original_owner_id: original_owner_id,
                shop: shop
            });
        }
    }
    return shop_ids;
}

const createProducts = (service: Service, products: Product[], shops: {id: number, original_owner_id: number, shop: Shop}[]): {id: number, shop_id: number, product: Product}[] => {
    let id_counter = 0;
    let product_ids: {id: number, shop_id: number, product: Product}[] = [];
    for (const product of products) {
        const shop = findShopByName(shops, product.shop_name)

        let purchase_type;
        if (product.purchase_type === "Offer"){
            purchase_type = Purchase_Type.Offer
        } else {
            purchase_type = Purchase_Type.Immediate;
        }
        const product_id = service.addProduct(
            shop.original_owner_id,
            String(shop.id),
            product.name,
            product.description,
            String(product.amount),
            product.categories,
            String(product.base_price),
            purchase_type.toString(),
        )
        if (typeof product_id === "string"){
            console.log('Cannot create product by init file -- ', product.name, product.shop_name)
            return [];
        } else {
            product_ids.push({
                id:  id_counter++,
                shop_id: shop.id,
                product: product
            });
        }
    }
    return product_ids;
}

const createDiscounts = (service: Service, discounts: any[], shops: {id: number, original_owner_id: number, shop: Shop}[]) => {
    for (const discount of discounts){
        const shop = findShopByName(shops, discount.shop_name)
        let result;
        if (discount.type === 'simple') {
            result = service.addDiscount(shop.original_owner_id, shop.id, discount.value)
        } else if (discount.type === 'conditional') {
            if (discount.condition === 'Category') {
                result = service.addConditionToDiscount(shop.original_owner_id, shop.id, discount.id, Condition.Category, discount.parameter)
            } else if (discount.condition === 'Product_Name') {
                result = service.addConditionToDiscount(shop.original_owner_id, shop.id, discount.id, Condition.Product_Name, discount.parameter)
            } else if (discount.condition === 'Amount') {
                result = service.addConditionToDiscount(shop.original_owner_id, shop.id, discount.id, Condition.Amount, discount.parameter)
            } else if (discount.condition === 'Shop') {
                result = service.addConditionToDiscount(shop.original_owner_id, shop.id, discount.id, Condition.Shop, discount.parameter)
            }
        } else if (discount.type === 'composite') {
            if (discount.operator === 'And'){
                result = service.addLogicComposeDiscount(shop.original_owner_id, shop.id, discount.id, discount.condition, discount.parameter)
            } else if (discount.operator === 'Or') {
                result = service.addLogicComposeDiscount(shop.original_owner_id, shop.id, discount.id, discount.condition, discount.parameter)
            } else if (discount.operator === 'Xor') {
                result = service.addLogicComposeDiscount(shop.original_owner_id, shop.id, discount.id, discount.condition, discount.parameter)
            } else if (discount.operator === 'Max') {
                result = service.addNumericComposeDiscount(shop.original_owner_id, shop.id, discount.id, discount.condition, discount.parameter)
            } else if (discount.operator === 'Add') {
                result = service.addNumericComposeDiscount(shop.original_owner_id, shop.id, discount.id, discount.condition, discount.parameter)
            }
        }
        if (typeof result === "string"){
            console.log('Cannot create product by init file -- ', discount.type, discount.id)
        }
    }
}
const findIdByUser = (collection: {id: number, user: User}[], username: string): number => {
    for (const element of collection){
        if (element.user.username === username){
            return element.id;
        }
    }
    return -1;
}

const findShopByName = (collection: {id: number, original_owner_id: number, shop: Shop}[], shop_name: string): {id: number, original_owner_id: number, shop: Shop} => {
    for (const element of collection){
        if (element.shop.name === shop_name){
            return element;
        }
    }
    return {
        id: -1,
        original_owner_id: -1,
        shop: {
            bank_info: "", description: "", location: "", name: "", original_owner: "", purchase_type: ""
        }
    };
}

type User = {
    username: string,
    password: string,
    age: string,
}

type Shop = {
    original_owner: string,
    name: string,
    description: string,
    location: string,
    bank_info: string,
    purchase_type: string
}

export type Product = {
    shop_name: string,
    purchase_type: string,
    name: string,
    amount: number,
    base_price: number,
    description: string,
    categories: string[],
}