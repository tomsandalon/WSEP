import {Order} from "../ProductHandling/Order";

export interface DeliveryHandler {
    deliver(address: string, order: Order): string | boolean
}

export class DeliveryHandlerImpl implements DeliveryHandler {
    private static instance: DeliveryHandler;

    private constructor(){}

    public static getInstance(): DeliveryHandler {
        if(!this.instance) {
            this.instance = new DeliveryHandlerImpl();
        }
        return this.instance
    }
    deliver(address: string, order: Order): string | boolean {
        return true;
    }
}