import {Service} from "./Service/Service";
import {panicLogger} from "./Domain/Logger";
import {SystemImpl} from "./Domain/System";
import * as DBCommand from "./Domain/DBCommand"

const fs = require('fs');
const path = require('path');

const initFileName = '../Actions.json'
export const initData = async (service: Service): Promise<boolean> => {
    await DBCommand.ClearDB()
    await service.system.init()
    service.system = SystemImpl.getInstance()
    const data = JSON.parse(fs.readFileSync(path.join(__dirname, initFileName), 'utf8')).Operations;
    if (data == undefined) return false
    try {
        for (let i = 0; i < Infinity; i++) {
            const operation = data[i]
            if (operation == undefined) {
                i = Infinity
                continue
            }
            let result
            let [action, ...parameters] = operation
            switch (action) {
                case "AddConditionToDiscount":
                    result = service.addConditionToDiscount.apply(this, parameters)
                    if (typeof result == "string") return false
                    break
                case "AddDiscount":
                    result = service.addDiscount.apply(this, parameters)
                    if (typeof result == "string") return false
                    break
                case "AddLogicComposeDiscount":
                    result = service.addLogicComposeDiscount.apply(this, parameters)
                    if (typeof result == "string") return false
                    break
                case "AddNumericComposeDiscount":
                    result = service.addNumericComposeDiscount.apply(this, parameters)
                    if (typeof result == "string") return false
                    break
                case "AddPurchasePolicy":
                    result = service.addPurchasePolicy.apply(this, parameters)
                    if (typeof result == "string") return false
                    break
                case "PerformLogin":
                    result = service.performLogin.apply(this, parameters)
                    if (typeof result == "string") return false
                    break
                case "Logout":
                    result = service.logout.apply(this, parameters)
                    if (typeof result == "string") return false
                    break
                case "ComposePurchasePolicy":
                    result = service.composePurchasePolicy.apply(this, parameters)
                    if (typeof result == "string") return false
                    break
                case "RemoveOwner":
                    result = service.removeOwner.apply(this, parameters)
                    if (typeof result == "string") return false
                    break
                case "RemovePurchasePolicy":
                    result = service.removePurchasePolicy.apply(this, parameters)
                    if (typeof result == "string") return false
                    break
                case "AddItemToBasket":
                    result = service.addItemToBasket.apply(this, parameters)
                    if (typeof result == "string") return false
                    break
                case "AddPermissions":
                    result = service.addPermissions.apply(this, parameters)
                    if (typeof result == "string") return false
                    break
                case "AddProduct":
                    result = service.addProduct.apply(this, parameters)
                    if (typeof result == "string") return false
                    break
                case "AddShop":
                    result = service.addShop.apply(this, parameters)
                    if (typeof result == "string") return false
                    break
                case "AppointManager":
                    result = service.appointManager.apply(this, parameters)
                    if (typeof result == "string") return false
                    break
                case "AppointOwner":
                    result = service.appointOwner.apply(this, parameters)
                    if (typeof result == "string") return false
                    break
                case "EditPermissions":
                    result = service.editPermissions.apply(this, parameters)
                    if (typeof result == "string") return false
                    break
                case "EditProduct":
                    result = service.editProduct.apply(this, parameters)
                    if (typeof result == "string") return false
                    break
                case "EditShoppingCart":
                    result = service.editShoppingCart.apply(this, parameters)
                    if (typeof result == "string") return false
                    break
                case "RemoveItemFromBasket":
                    result = service.removeItemFromBasket.apply(this, parameters)
                    if (typeof result == "string") return false
                    break
                case "PerformRegister":
                    result = service.performRegister.apply(this, parameters)
                    if (typeof result == "string") return false
                    break
                case "PurchaseCart":
                    result = service.purchaseCart.apply(this, parameters)
                    if (typeof result == "string") return false
                    break
                case "PurchaseShoppingBasket":
                    result = service.purchaseShoppingBasket.apply(this, parameters)
                    if (typeof result == "string") return false
                    break
                case "RemoveManager":
                    result = service.removeManager.apply(this, parameters)
                    if (typeof result == "string") return false
                    break
                case "RemoveProduct":
                    result = service.removeProduct.apply(this, parameters)
                    if (typeof result == "string") return false
                    break
                case "RemoveDiscount":
                    result = service.removeDiscount.apply(this, parameters)
                    if (typeof result == "string") return false
                    break
                case "RateProduct":
                    result = service.rateProduct.apply(this, parameters)
                    if (typeof result == "string") return false
                    break
                case "RemovePermission":
                    result = service.removePermission.apply(this, parameters)
                    if (typeof result == "string") return false
                    break
                case "MakeOffer":
                    result = service.makeOffer.apply(this, parameters)
                    if (typeof result == "string") return false
                    break
                case "AcceptOfferAsManagement":
                    result = service.acceptOfferAsManagement.apply(this, parameters)
                    if (typeof result == "string") return false
                    break
                case "DenyOfferAsManagement":
                    result = service.denyOfferAsManagement.apply(this, parameters)
                    if (typeof result == "string") return false
                    break
                case "CounterOfferAsManager":
                    result = service.counterOfferAsManager.apply(this, parameters)
                    if (typeof result == "string") return false
                    break
                case "DenyCounterOfferAsUser":
                    result = service.denyCounterOfferAsUser.apply(this, parameters)
                    if (typeof result == "string") return false
                    break
                case "PurchaseOffer":
                    result = service.purchaseOffer.apply(this, parameters)
                    if (typeof result == "string") return false
                    break
                case "RemovePurchaseType":
                    result = service.removePurchaseType.apply(this, parameters)
                    if (typeof result == "string") return false
                    break
                case "AddPurchaseType":
                    result = service.addPurchaseType.apply(this, parameters)
                    if (typeof result == "string") return false
                    break
                case "CounterOfferAsUser":
                    result = service.counterOfferAsUser.apply(this, parameters)
                    if (typeof result == "string") return false
                    break
                default:
                    panicLogger.Critical(`${action} is not a propper action`)
                    return false;
            }
        }
        return true;
    } catch (e) {
        panicLogger.Critical(e)
        return false
    }
}
