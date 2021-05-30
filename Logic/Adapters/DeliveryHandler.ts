import {Order} from "../ProductHandling/Order";

export interface DeliveryHandler {
    getInstance(): DeliveryHandler,
    deliver(address: string, order: Order): string | boolean
}