import 'mocha';
import * as Parallel from 'async-parallel';
import { expect, assert } from 'chai';
import {ProductImpl} from "../../../Logic/Domain/ProductHandling/Product";

const createProduct = () => {
    const temp = ProductImpl.create(1000, "Best 29 inch Monitor", "LG monitor", {});
    if(typeof temp === "string"){
        assert.fail("Failed to created product")
    }
    return temp
};

describe('Product Class Testsuit', () => {
    it('should return 2', () => {
        Parallel.pool(2,
            async () => {
                return true;
        });
    });
});