import {expect} from "chai";
import {PaymentAndSupplyAdapter} from "../../../../ExternalApiAdapters/PaymentAndSupplyAdapter";
import {describe} from "mocha";
import * as DBCommand from "../../../../Logic/Domain/DBCommand"

DBCommand.turnBlockDBON()
describe("test payment handler system ", () => {
    it('pay function', async () => {
        let result = 0
        await PaymentAndSupplyAdapter.getInstance().pay("451892371239080", "08", "2018", "Ronen", "250", "314089651")
            .then(res => result = res)
        expect(result).greaterThanOrEqual(10000)
        expect(result).lessThanOrEqual(100000)
    })
    it('pay function', async () => {
        const result = await PaymentAndSupplyAdapter.getInstance().pay("4580", "08", "2018", "Ronen", "986", "314089651")
        expect(result).to.be.eq(-1)
    })
    it('pay function', async () => {
        const result = await PaymentAndSupplyAdapter.getInstance().pay("4580", "08", "2018", "Ronen", "984", "314089651")
        expect(result).to.be.eq(-1)
    })
})