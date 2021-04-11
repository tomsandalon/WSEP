const { expect } = require('chai');  // Using Expect style


describe("This is a test", () => {
    it('this is a subtest', () => {
        const t = true;
        expect(t).to.be.true;
    })
})