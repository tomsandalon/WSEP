export interface PurchasePolicyHandler { //TODO empty until further updates
    getInstance(): PurchasePolicyHandler,
    isAllowed(object: any): boolean
}