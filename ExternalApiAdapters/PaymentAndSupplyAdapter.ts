const unirest = require('unirest');

const URL = "https://cs-bgu-wsep.herokuapp.com/"
const POST = 'POST'

export class PaymentAndSupplyAdapter {

    private static instance: PaymentAndSupplyAdapter | undefined

    private constructor() {
    }

    static getInstance(): PaymentAndSupplyAdapter {
        if (!this.instance) this.instance = new PaymentAndSupplyAdapter()
        return this.instance
    }

    async handshake(): Promise<boolean> {
        return unirest(POST, URL)
            .field('action_type', 'handshake')
            .end((res: { error: string | undefined; raw_body: any; }) => {
                if (res.error) return false;
                return res.raw_body == "OK"
            });
    }

    async pay(card_number: string, month: string, year: string, holder: string, ccv: string, id: string): Promise<number> {
        return unirest(POST, URL)
            .field('action_type', 'pay')
            .field('card_number', card_number)
            .field('month', month)
            .field('year', year)
            .field('holder', holder)
            .field('ccv', ccv)
            .field('id', id)
            .end(this.getResult());
    }

    async cancel_pay(transaction_id: string): Promise<number> {
        return unirest(POST, URL)
            .field('action_type', 'cancel_pay')
            .field('transaction_id', transaction_id)
            .end(this.getResult());
    }

    async supply(name: string, address: string, city: string, country: string, zip: string): Promise<number> {
        return unirest(POST, URL)
            .field('action_type', 'supply')
            .field('name', name)
            .field('address', address)
            .field('city', city)
            .field('country', country)
            .field('zip', zip)
            .end(this.getResult());
    }

    async cancel_supply(transaction_id: string): Promise<number> {
        return unirest(POST, URL)
            .field('action_type', 'cancel_supply')
            .field('transaction_id', transaction_id)
            .end(this.getResult());
    }

    private getResult() {
        return (res: { error: string | undefined; raw_body: any; }) => {
            if (res.error) return -1;
            const ret = Number(res.raw_body);
            return isNaN(ret) ? -1 : ret
        };
    }
}