import 'mocha';
import { expect, assert } from 'chai';
import {ProductImpl} from "../../../Logic/ProductHandling/Product";

const createProduct = () => {
    const temp = ProductImpl.create(1000, "Best 29 inch Monitor", "LG monitor", {});
    if(typeof temp === "string"){
        assert.fail("Failed to created product")
    }
    return temp
};

describe('Product Class Testsuit', () => {
    it('should return 2', () => {

    });
});