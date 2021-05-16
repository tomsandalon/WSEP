export interface PaymentHandler {
    charge(payment_method: string, amount: number, bank_info: string): boolean | string
    cancelCharge(payment_method: string, amount: number, bank_info: string): boolean | string
}

export class PaymentHandlerImpl implements PaymentHandler {
    public static REJECT_CHARGE = false; // for testing integration with payment handling
    private static instance: PaymentHandler;
    private constructor(){
    }

    charge(payment_method: string, amount: number, bank_info: string): boolean | string {
        if (payment_method.includes("fail")) return false;
        return !PaymentHandlerImpl.REJECT_CHARGE
    }

    public static getInstance(): PaymentHandler {
        if(!this.instance) {
            this.instance = new PaymentHandlerImpl();
        }
        return this.instance
    }

    cancelCharge(payment_method: string, amount: number, bank_info: string): boolean | string {
        return true;
    }
}