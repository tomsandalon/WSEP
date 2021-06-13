import {PaymentAndSupplySystem} from "./PaymentAndSupplySystem";

const unirest = require('unirest');

let blockExternalServices: boolean = false

export type Purchase_Info = {
    payment_info: {
        holder_id: string
        holder_name: string,
        card_number: string,
        month: string,
        year: string,
        ccv: string,
    }
    delivery_info: {
        name: string,
        address: string,
        city: string,
        country: string,
        zip: string
    }
}

const HIGH = 100000
const LOW = 10000

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

export class PaymentAndSupplyAdapter {

    private external_system: PaymentAndSupplySystem


    private static instance: PaymentAndSupplyAdapter | undefined

    private constructor() {
        this.external_system = PaymentAndSupplySystem.getInstance()
    }

    static TurnOnBlocking = () => blockExternalServices = true

    static getInstance(): PaymentAndSupplyAdapter {
        if (!this.instance) this.instance = new PaymentAndSupplyAdapter()
        return this.instance
    }

    async handshake(): Promise<boolean> {
        return blockExternalServices ? Promise.resolve(true) : this.external_system.handshake()
    }

    async pay(card_number: string, month: string, year: string, holder: string, ccv: string, id: string): Promise<number> {
        return blockExternalServices ? Promise.resolve(getRandomInt(HIGH - LOW) + LOW) : this.external_system.pay(card_number, month, year, holder, ccv, id)
    }

    async cancel_pay(transaction_id: string): Promise<number> {
        return blockExternalServices ? Promise.resolve(1) : this.external_system.cancel_pay(transaction_id)
    }

    async supply(name: string, address: string, city: string, country: string, zip: string): Promise<number> {
        return blockExternalServices ? Promise.resolve(getRandomInt(HIGH - LOW) + LOW) : this.external_system.supply(name, address, city, country, zip)
    }

    async cancel_supply(transaction_id: string): Promise<number> {
        return blockExternalServices ? Promise.resolve(1) : this.cancel_supply(transaction_id)
    }
}