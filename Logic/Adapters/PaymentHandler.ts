export interface PaymentHandler {
    getInstance(): PaymentHandler,
    charge(payment_method: string, amount: number, bank_info: string): boolean | string
}