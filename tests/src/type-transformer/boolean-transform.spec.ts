import {DefaultTypeTransformer} from "../../../src/type-transformation/models/def.type-transformer";
import chai = require("chai");

const transformer = new DefaultTypeTransformer();

describe("Boolean transformations", () => {

    it(`must transform booleans "true" and "false" to "true" and "false" respectively.`, () => {
        chai.expect(transformer.transform(true, Boolean)).to.be.equal(true);
        chai.expect(transformer.transform(false, Boolean)).to.be.equal(false);
    });

    it(`must transform strings "true" and "false" to "true" and "false" respectively.`, () => {
        chai.expect(transformer.transform("true", Boolean)).to.be.equal(true);
        chai.expect(transformer.transform("false", Boolean)).to.be.equal(false);
    });

    it(`must transform strings "1" and "0" to "true" and "false" respectively.`, () => {
        chai.expect(transformer.transform("1", Boolean)).to.be.equal(true);
        chai.expect(transformer.transform("0", Boolean)).to.be.equal(false);
    });

    it(`must transform numbers "1" and "0" to "true" and "false" respectively.`, () => {
        chai.expect(transformer.transform(1, Boolean)).to.be.equal(true);
        chai.expect(transformer.transform(1.0, Boolean)).to.be.equal(true);
        chai.expect(transformer.transform(+1, Boolean)).to.be.equal(true);
        chai.expect(transformer.transform(+1.0, Boolean)).to.be.equal(true);
        chai.expect(transformer.transform(0, Boolean)).to.be.equal(false);
        chai.expect(transformer.transform(+0, Boolean)).to.be.equal(false);
        chai.expect(transformer.transform(+0.0, Boolean)).to.be.equal(false);
        chai.expect(transformer.transform(+0.0, Boolean)).to.be.equal(false);
        chai.expect(transformer.transform(-0, Boolean)).to.be.equal(false);
        chai.expect(transformer.transform(-0.0, Boolean)).to.be.equal(false);
        chai.expect(transformer.transform(+0.0, Boolean)).to.be.equal(false);
    });

    it(`must transform null and undefined to "false".`, () => {
        chai.expect(transformer.transform(null, Boolean)).to.be.equal(false);
        chai.expect(transformer.transform(undefined, Boolean)).to.be.equal(false);
    });

    it(`must fail transforming other strings (excluding null and undefined).`, () => {
        chai.assert.throws(() => transformer.transform("1.0", Boolean));
        chai.assert.throws(() => transformer.transform("+1.0", Boolean));
        chai.assert.throws(() => transformer.transform("0.0", Boolean));
        chai.assert.throws(() => transformer.transform("-0.0", Boolean));
        chai.assert.throws(() => transformer.transform("+0.0", Boolean));
        chai.assert.throws(() => transformer.transform("test", Boolean));
        chai.assert.throws(() => transformer.transform("", Boolean));
        chai.assert.throws(() => transformer.transform("\u00F8", Boolean));
        chai.assert.throws(() => transformer.transform("❤", Boolean));
        chai.assert.throws(() => transformer.transform("✿", Boolean));
    });

    it(`must fail transform other numbers to boolean.`, () => {
        chai.assert.throws(() => transformer.transform(-1, Boolean));
        chai.assert.throws(() => transformer.transform(532, Boolean));
        chai.assert.throws(() => transformer.transform(5.32, Boolean));
        chai.assert.throws(() => transformer.transform(-5.32, Boolean));
        chai.assert.throws(() => transformer.transform(NaN, Boolean));
        chai.assert.throws(() => transformer.transform(-NaN, Boolean));
        chai.assert.throws(() => transformer.transform(+NaN, Boolean));
    });

    it(`must fail transforming not appropriate values: objects, arrays, functions.`, () => {
        chai.assert.throws(() => transformer.transform({}, Boolean));
        chai.assert.throws(() => transformer.transform([5, 4], Boolean));
        chai.assert.throws(() => transformer.transform(new Function(), Boolean));
        chai.assert.throws(() => transformer.transform(new Buffer("42"), Boolean));
        chai.assert.throws(() => transformer.transform(Symbol.for("42"), Boolean));
        chai.assert.throws(() => transformer.transform(new Date(), Boolean));
        chai.assert.throws(() => transformer.transform(new Error(), Boolean));
    });
});