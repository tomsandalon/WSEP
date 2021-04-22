import {Purchase} from "../../Domain/ProductHandling/Purchase";

export interface DeliveryHandler {
    deliver(address: string, order: Purchase): string | boolean
}

export class DeliveryHandlerImpl implements DeliveryHandler {
    public static REJECT_DELIVERY = false; // for testing integration with payment handling
    private static instance: DeliveryHandler;

    private constructor(){}

    public static getInstance(): DeliveryHandler {
        if(!this.instance) {
            this.instance = new DeliveryHandlerImpl();
        }
        return this.instance
    }
    deliver(address: string, order: Purchase): string | boolean {
        return !DeliveryHandlerImpl.REJECT_DELIVERY;
    }
}