import {assert, expect} from "chai";
import {PaymentAndSupplyAdapter} from "../../../../ExternalApiAdapters/PaymentAndSupplyAdapter";
import {describe} from "mocha";
import {response} from "express";

//TODO

describe("test delivery system ", () => {
    it('supply function - happy' , () => {
        PaymentAndSupplyAdapter.getInstance().supply("","","","","")
            .then(result => {
                expect( result).greaterThanOrEqual(10000)
                expect(result).lessThanOrEqual(100000)
            } )
    })
})