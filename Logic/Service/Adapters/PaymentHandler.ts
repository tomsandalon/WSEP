export interface PaymentHandler {
    charge(payment_method: string, amount: number, bank_info: string): boolean | string
}

export class PaymentHandlerImpl implements PaymentHandler {
    private static instance: PaymentHandler;

    private constructor(){
    }

    charge(payment_method: string, amount: number, bank_info: string): boolean | string {
        return true
    }

    public static getInstance(): PaymentHandler {
        if(!this.instance) {
            this.instance = new PaymentHandlerImpl();
        }
        return this.instance
    }
}