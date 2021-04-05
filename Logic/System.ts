//TODO Initialize the system and needed objects.
//TODO create admin on init

//TODO

import {User} from "./Users/User";
import {Shop} from "./Shop/Shop";
import {logger} from "./Logger";

interface System{
    shops: Shop[]

    displayMenu():void // TODO UI JUST FOR US
    logout(): boolean
    register(): boolean
    login(): User | null
    addShop(user_email: string, name: string, description: string,
            location: string, bank_info:string): number | null
    getUserHistory(admin_email: string, target_user_email: string): any
    getShopHistory(admin_email: string, shop_id: number): any

    //shop_id: number
    //     name: string
    //     description: string
    //     location: string
    //     bank_info: string
    //     inventory: ShopInventory
    //     management: ShopManagement

}
// //LOGGED EXAMPLES:
// logger.Critical("Critical", "message");
// logger.Debug("Debug", "message");
// logger.Error("Error", "message");
// logger.Info("Info", "message");
// logger.Warn("Warn", "message");
//logger.Trace("message", "with trace");
