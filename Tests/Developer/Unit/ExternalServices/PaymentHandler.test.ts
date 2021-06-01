import {assert, expect} from "chai";
import {PaymentAndSupplyAdapter} from "../../../../ExternalApiAdapters/PaymentAndSupplyAdapter";
import {describe} from "mocha";

describe("test payment handler system ", () => {
    it('pay function' , () => {
        PaymentAndSupplyAdapter.getInstance().pay("4580","october","2018","Ronen","250","314089651" )
            .then(result => {
                expect( result).greaterThanOrEqual(10000)
                expect(result).lessThanOrEqual(100000)
            })
    })
})