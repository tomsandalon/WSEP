import 'mocha';
import { expect, assert } from 'chai';
import {Product, ProductImpl} from "../../../Logic/ProductHandling/Product";
import * as Error from "../../../Logic/ProductHandling/ErrorMessages";
import {
    AmountIsLargerThanStock,
    AmountNonPositiveValue,
    BasePriceNonPositiveValue,
    DescriptionEmpty, ProductNameEmpty
} from "../../../Logic/ProductHandling/ErrorMessages";
import {CategoryImpl} from "../../../Logic/ProductHandling/Category";
import {DiscountType} from "../../../Logic/PurchaseProperties/DiscountType";

const createProduct = () => {
    const temp = ProductImpl.create(1000, "Best 29 inch Monitor", "LG monitor", {});
    if(typeof temp === "string"){
        assert.fail("Failed to created product")
    }
    return temp
};

describe('ProductImpl Class Test suit', () => {
    describe('Create Product', () => {
        it('Create with negative base price', () => {
            expect(ProductImpl.create(-1, "29 inch monitor", "LG monitor", {}))
                .equal(Error.BasePriceNonPositiveValue)
        });
        it('Create with zero as base price', () => {
            expect(ProductImpl.create(0, "29 inch monitor", "LG monitor", {}))
                .equal(Error.BasePriceNonPositiveValue)
        });
        it('Create with empty description', () => {
            expect(ProductImpl.create(1000, "", "LG monitor", {}))
                .equal(Error.DescriptionEmpty)
        });
        it('Create with empty name', () => {
            expect(ProductImpl.create(1000, "29 inch monitor", "", {}))
                .equal(Error.ProductNameEmpty)
        });
    });
    describe('Public functions', () => {
        describe('addSupplies', () => {
            it('Add negative amount', () => {
                const product = createProduct();
                expect(product.addSupplies(-1)).equal(AmountNonPositiveValue);
            });
            it('Add zero amount', () => {
                const product = createProduct();
                expect(product.addSupplies(0)).equal(AmountNonPositiveValue);
            });
            it('Add positive amount', () => {
                const product = createProduct();
                const before = product.amount;
                const delta = 10;
                const result = product.addSupplies(delta);
                expect(typeof result).equal("boolean");
                expect(product.amount).equal(before + delta);
            });
        });
        describe('makePurchase', () => {
            it('purchase negative amount', () => {
                const product = createProduct();
                expect(product.makePurchase(-1)).equal(AmountNonPositiveValue);
            });
            it('purchase zero amount', () => {
                const product = createProduct();
                expect(product.makePurchase(0)).equal(AmountNonPositiveValue);
            });
            it('purchase positive amount and equal to stock', () => {
                const delta = 10;
                const product = createProduct();
                const addSuppliesResult = product.addSupplies(delta);
                expect(typeof addSuppliesResult).equal("boolean");
                const before = product.amount;
                const result = product.makePurchase(delta);
                expect(typeof result).equal("boolean");
                expect(product.amount).equal(before - delta);
            });
            it('purchase positive amount and less than stock', () => {
                const delta = 10;
                const product = createProduct();
                const addSuppliesResult = product.addSupplies(2*delta);
                expect(typeof addSuppliesResult).equal("boolean");
                const before = product.amount;
                const result = product.makePurchase(delta);
                expect(typeof result).equal("boolean");
                expect(product.amount).equal(before - delta);
            });
            it('purchase positive amount and more than stock', () => {
                const delta = 10;
                const product = createProduct();
                const addSuppliesResult = product.addSupplies(delta/2);
                expect(typeof addSuppliesResult).equal("boolean");
                const result = product.makePurchase(delta);
                expect(result).equal(AmountIsLargerThanStock);
            });
        });
        describe('changePrice', () => {
            it('change to negative price', () => {
                const product = createProduct();
                expect(product.changePrice(-1)).equal(BasePriceNonPositiveValue);
            });
            it('change to zero price', () => {
                const product = createProduct();
                expect(product.changePrice(0)).equal(BasePriceNonPositiveValue);
            });
            it('change to positive price', () => {
                const product = createProduct();
                const before = product.base_price;
                const delta = 10;
                const result = product.changePrice(delta);
                expect(typeof result).equal("boolean");
                expect(product.base_price).not.equal(before);
                expect(product.base_price).equal(delta);
            });
        });
        describe('addCategory', () => {
            it('', () => {
                const product = createProduct();
                const delta = CategoryImpl.create("Monitors");
                if (typeof delta === "string") assert.fail("Failed to create Category");
                const result = product.addCategory(delta);
                expect(typeof result).equal("boolean");
                expect(product.category.indexOf(delta)).greaterThanOrEqual(0);
            });
        });
        describe('removeCategory', () => {
            it('', () => {
                const product = createProduct();
                const delta = CategoryImpl.create("Monitors");
                if (typeof delta === "string") assert.fail("Failed to create Category");
                const result = product.addCategory(delta);
                expect(typeof result).equal("boolean");
                expect(product.category.indexOf(delta)).greaterThanOrEqual(0);
                const result2 = product.removeCategory(delta);
                expect(typeof result2).equal("boolean");
                expect(product.category.indexOf(delta)).lessThan(0);
                const otherDelta = CategoryImpl.create("Monitors");
                if (typeof otherDelta === "string") assert.fail("Failed to create Category");
            });
        });
        describe('removeDiscountType', () => {
            it('', () => {
                const product = createProduct();
                //TODO Implement Milestone 2

                // assert.fail("Test case not implemented")
            });
        });
        describe('addDiscountType', () => {
            it('', () => {
                const product = createProduct();
                //TODO Implement Milestone 2

                // assert.fail("Test case not implemented")
            });
        });
        describe('changeDescription', () => {
            it('Change to non empty description', () => {
                const product = createProduct();
                const delta = "Best of the best of the best 29 inch monitor";
                const before = product.description;
                const result = product.changeDescription(delta);
                expect(typeof result).equal("boolean");
                expect(before).not.equal(product.description);
                expect(delta).equal(product.description);
            });
            it('Change to empty description', () => {
                const product = createProduct();
                const delta = "";
                const result = product.changeDescription(delta);
                expect(result).equal(DescriptionEmpty);
            });
        });
        describe('changeName', () => {
            it('Change to non empty name', () => {
                const product = createProduct();
                const delta = "Samsung monitor";
                const before = product.name;
                const result = product.changeName(delta);
                expect(typeof result).equal("boolean");
                expect(before).not.equal(product.name);
                expect(delta).equal(product.name);
            });
            it('Change to empty name', () => {
                const product = createProduct();
                const delta = "";
                const result = product.changeName(delta);
                expect(result).equal(ProductNameEmpty);
            });
        });
        describe('changePurchaseType', () => {
            it('', () => {
                const product = createProduct();
                //TODO Implement Milestone 2

                // assert.fail("Test case not implemented")
            });
        });
        describe('calculatePrice', () => {
            it('', () => {
                const product = createProduct();
                //TODO Implement Milestone 2

                // assert.fail("Test case not implemented")
            });
        });
        describe('returnAmount', () => {
            it('Return negative amount', () => {
                const product = createProduct();
                const delta = -1;
                const result = product.returnAmount(delta);
                expect(result).equal(AmountNonPositiveValue);
            });
            it('Return zero amount', () => {
                const product = createProduct();
                const delta = 0;
                const result = product.returnAmount(delta);
                expect(result).equal(AmountNonPositiveValue);
            });
            it('Return positive amount', () => {
                const product = createProduct();
                const delta = 11;
                const before = product.amount;
                const result = product.returnAmount(delta);
                expect(typeof result).equal("boolean");
                expect(product.amount).equal(before + delta);
            });
        });
    });
});