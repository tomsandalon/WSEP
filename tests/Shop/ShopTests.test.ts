import 'mocha';
import { expect, assert } from 'chai';
import {ShopImpl} from "../../Logic/Shop/Shop";

describe('Correctness Requirements', () => {
    it('4 - Open store must have at least one owner', () => {
        const shop = new ShopImpl("some email", "bank info", "some description",
            "the big city", "The best test shop ever")
        expect(shop.is_active ? shop.management.owners.concat(shop.management.original_owner).length > 0 :
                                    true).to.be.true;
})})

describe('') //