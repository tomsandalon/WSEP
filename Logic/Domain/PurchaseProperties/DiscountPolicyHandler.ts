export interface DiscountPolicyHandler { //TODO empty until further updates
    getInstance(): DiscountPolicyHandler,
    isAllowed(object: any): boolean
}