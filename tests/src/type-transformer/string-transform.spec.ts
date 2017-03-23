import {DefaultTypeTransformer} from "../../../src/type-transformation/models/def.type-transformer";
import chai = require("chai");

const transformer = new DefaultTypeTransformer();

describe("String transformations", () => {
    it(`must transform strings to same strings.`, () => {
        chai.expect(transformer.transform("1.0", String)).to.be.equal("1.0");
        chai.expect(transformer.transform("+1.0", String)).to.be.equal("+1.0");
        chai.expect(transformer.transform("0.0", String)).to.be.equal("0.0");
        chai.expect(transformer.transform("-0.0", String)).to.be.equal("-0.0");
        chai.expect(transformer.transform("+0.0", String)).to.be.equal("+0.0");
        chai.expect(transformer.transform("test", String)).to.be.equal("test");
        chai.expect(transformer.transform("", String)).to.be.equal("");
        chai.expect(transformer.transform("\u00F8", String)).to.be.equal("\u00F8");
        chai.expect(transformer.transform("❤", String)).to.be.equal("❤");
        chai.expect(transformer.transform("✿", String)).to.be.equal("✿");
    });

    it(`must transform boolean "true" and "false" to strings "true" and "false" respectively.`, () => {
        chai.expect(transformer.transform(true, String)).to.be.equal("true");
        chai.expect(transformer.transform(false, String)).to.be.equal("false");
    });

    it(`must transform "null" and "undefined" to empty string.`, () => {
        chai.expect(transformer.transform(null, String)).to.be.equal("");
        chai.expect(transformer.transform(undefined, String)).to.be.equal("");
    });

    it(`must transform numbers to strings that contain same number values.`, () => {
        chai.expect(transformer.transform(1.0004, String)).to.be.equal("1.0004");
        chai.expect(transformer.transform(-5.3, String)).to.be.equal("-5.3");
        chai.expect(transformer.transform(+1.4, String)).to.be.equal("1.4");
        chai.expect(transformer.transform(0.0, String)).to.be.equal("0");
        chai.expect(transformer.transform(-0.0, String)).to.be.equal("0");
        chai.expect(transformer.transform(+0.0, String)).to.be.equal("0");
        chai.expect(transformer.transform(NaN, String)).to.be.equal("NaN");
        chai.expect(transformer.transform(-NaN, String)).to.be.equal("NaN");
        chai.expect(transformer.transform(+NaN, String)).to.be.equal("NaN");
    });

    it("must transform buffers to strings.", () => {
        chai.expect(transformer.transform(new Buffer("42"), String)).to.be.equal("42");
        chai.expect(transformer.transform(new Buffer(2).fill(0), String)).to.be.equal("\u0000\u0000");
    });

    it(`must fail transforming not appropriate values: objects, arrays, functions (except buffers).`, () => {
        chai.assert.throws(() => transformer.transform({}, String));
        chai.assert.throws(() => transformer.transform([5, 4], String));
        chai.assert.throws(() => transformer.transform(new Function(), String));
        chai.assert.throws(() => transformer.transform(Symbol.for("42"), String));
        chai.assert.throws(() => transformer.transform(new Date(), String));
        chai.assert.throws(() => transformer.transform(new Error(), String));
    });
});