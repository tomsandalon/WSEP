const unirest = require('unirest');
import {getExternalServices} from '../Logic/Config';

const URL = getExternalServices();
const POST = 'POST'

const TIME_OUT_VALUE = 1500

export class PaymentAndSupplySystem {

    private static instance: PaymentAndSupplySystem | undefined

    private constructor() {
    }

    static getInstance(): PaymentAndSupplySystem {
        if (!this.instance) this.instance = new PaymentAndSupplySystem()
        return this.instance
    }

    async handshake(): Promise<boolean> {
        return new Promise((resolve, reject) =>

            unirest(POST, URL)
                .field('action_type', 'handshake')
                .timeout(TIME_OUT_VALUE)
                .end(function (response) {
                    if (response.error) return false
                    return resolve(response.raw_body.toLowerCase() == "OK".toLowerCase())
                })
        )
    }

    async pay(card_number: string, month: string, year: string, holder: string, ccv: string, id: string): Promise<number> {
        return new Promise((resolve, reject) =>
            unirest(POST, URL)
                .field('action_type', 'pay')
                .field('card_number', card_number)
                .field('month', month)
                .field('year', year)
                .field('holder', holder)
                .field('ccv', ccv)
                .field('id', id)
                .timeout(TIME_OUT_VALUE)
                .end(function (response) {
                    if (response.error) return false
                    const ret = Number(response.raw_body);
                    return resolve(isNaN(ret) ? -1 : ret)
                })
        )
    }

    async cancel_pay(transaction_id: string): Promise<number> {
        return new Promise((resolve, reject) =>
            unirest(POST, URL)
                .field('action_type', 'cancel_pay')
                .field('transaction_id', transaction_id)
                .timeout(TIME_OUT_VALUE)
                .end(function (response) {
                    if (response.error) return false
                    const ret = Number(response.raw_body);
                    return resolve(isNaN(ret) ? -1 : ret)
                })
        )
    }

    async supply(name: string, address: string, city: string, country: string, zip: string): Promise<number> {
        return new Promise((resolve, reject) =>
            unirest(POST, URL)
                .field('action_type', 'supply')
                .field('name', name)
                .field('address', address)
                .field('city', city)
                .field('country', country)
                .field('zip', zip)
                .timeout(TIME_OUT_VALUE)
                .end(function (response) {
                    if (response.error) return false
                    const ret = Number(response.raw_body);
                    return resolve(isNaN(ret) ? -1 : ret)
                })
        )
    }

    async cancel_supply(transaction_id: string): Promise<number> {
        return new Promise((resolve, reject) =>
            unirest(POST, URL)
                .field('action_type', 'cancel_supply')
                .field('transaction_id', transaction_id)
                .timeout(TIME_OUT_VALUE)
                .end(function (response) {
                    if (response.error) return false
                    const ret = Number(response.raw_body);
                    return resolve(isNaN(ret) ? -1 : ret)
                })
        )
    }
}