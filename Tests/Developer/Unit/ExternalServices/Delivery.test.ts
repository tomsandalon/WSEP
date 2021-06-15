import {expect} from "chai";
import {PaymentAndSupplyAdapter} from "../../../../ExternalApiAdapters/PaymentAndSupplyAdapter";
import {describe} from "mocha";
import * as DBCommand from "../../../../Logic/Domain/DBCommand"

DBCommand.turnBlockDBON()

describe("test delivery system ", () => {
    it('supply function - happy' , () => {
        PaymentAndSupplyAdapter.getInstance().supply("Tom", "Maas", "Not Beer Sheva", "Philippines", "496351")
            .then(result => {
                expect( result).greaterThanOrEqual(10000)
                expect(result).lessThanOrEqual(100000)
            } )
    })
})