export interface DiscountType { //TODO ignore until further updates
    percent: number // 0 <= percent <= 1
    expiration_date: Date
    can_be_applied(value: any): boolean //TODO
    applyDiscount(price: number): number;
}