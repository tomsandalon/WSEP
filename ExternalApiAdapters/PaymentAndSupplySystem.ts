import {sleep} from "async-parallel";
import {getExternalServices} from '../Logic/Config';

const unirest = require('unirest');

const URL = getExternalServices();
const POST = 'POST'

const TIME_OUT_VALUE = 3500

const timeout_handshake = (prom, time) =>
    Promise.race([prom, new Promise((_r, _) => setTimeout(_ => false, time))]);

const timeout = (prom, time) =>
    Promise.race([prom, new Promise((_r, _) => setTimeout(_ => -1, time))]);

export class PaymentAndSupplySystem {

    private static instance: PaymentAndSupplySystem | undefined


    private constructor() {
    }

    static getInstance(): PaymentAndSupplySystem {
        if (!this.instance) this.instance = new PaymentAndSupplySystem()
        return this.instance
    }

    async handshake(): Promise<boolean> {
        let result = 0
        sleep(TIME_OUT_VALUE).then(_ => result = -1)
        const handshake_promise = new Promise((resolve, reject): Promise<boolean> =>
            unirest(POST, URL)
                .field('action_type', 'handshake')
                // .timeout(TIME_OUT_VALUE)
                .end(function (response) {
                    if (response.error) return false
                    return resolve(response.raw_body.toLowerCase() == "OK".toLowerCase())
                }))
        handshake_promise.then(res => {
            result = res ? 1 : -1
        })
        while (result == 0) {
            await sleep(50)
        }
        return result == 1
    }

    async pay(card_number: string, month: string, year: string, holder: string, ccv: string, id: string): Promise<number> {
        let result: number = 0
        sleep(TIME_OUT_VALUE).then(_ => result = -1)
        const pay_promise = new Promise((resolve, reject): Promise<number> =>
            unirest(POST, URL)
                .field('action_type', 'pay')
                .field('card_number', card_number)
                .field('month', month)
                .field('year', year)
                .field('holder', holder)
                .field('ccv', ccv)
                .field('id', id)
                .end(function (response) {
                    if (response.error) return false
                    const ret = Number(response.raw_body);
                    return resolve(isNaN(ret) ? -1 : ret)
                })
        )
        pay_promise.then(res => {
            // @ts-ignore
            result = res
        })
        while (result == 0) {
            await sleep(50)
        }
        return result
        // return timeout(pay_promise, TIME_OUT_VALUE)
    }

    async cancel_pay(transaction_id: string): Promise<number> {
        let result = 0
        sleep(TIME_OUT_VALUE).then(_ => result = -1)
        const cancel_pay_promise = new Promise((resolve, reject) =>
            unirest(POST, URL)
                .field('action_type', 'cancel_pay')
                .field('transaction_id', transaction_id)
                .end(function (response) {
                    if (response.error) return -1
                    const ret = Number(response.raw_body);
                    return resolve(isNaN(ret) ? -1 : ret)
                })
        )
        cancel_pay_promise.then(res => {
            // @ts-ignore
            result = res
        })
        while (result == 0) {
            await sleep(50)
        }
        return result
    }

    async supply(name: string, address: string, city: string, country: string, zip: string): Promise<number> {
        let result = 0
        sleep(TIME_OUT_VALUE).then(_ => result = -1)
        const supply_promise = new Promise((resolve, reject) =>
            unirest(POST, URL)
                .field('action_type', 'supply')
                .field('name', name)
                .field('address', address)
                .field('city', city)
                .field('country', country)
                .field('zip', zip)
                .end(function (response) {
                    if (response.error) return -1
                    const ret = Number(response.raw_body);
                    return resolve(isNaN(ret) ? -1 : ret)
                })
        )
        supply_promise.then(res => {
            // @ts-ignore
            result = res
        })
        while (result == 0) {
            await sleep(50)
        }
        return result
    }

    async cancel_supply(transaction_id: string): Promise<number> {
        let result = 0
        sleep(TIME_OUT_VALUE).then(_ => result = -1)
        const cancel_supply = new Promise((resolve, reject) =>
            unirest(POST, URL)
                .field('action_type', 'cancel_supply')
                .field('transaction_id', transaction_id)
                .end(function (response) {
                    if (response.error) return -1
                    const ret = Number(response.raw_body);
                    return resolve(isNaN(ret) ? -1 : ret)
                })
        )
        cancel_supply.then(res => {
            // @ts-ignore
            result = res
        })
        while (result == 0) {
            await sleep(50)
        }
        return result
    }
}