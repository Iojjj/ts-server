import {DefaultTypeTransformer} from "../../../src/public/type-transformation/models/def.type-transformer";
import chai = require("chai");

const transformer = new DefaultTypeTransformer();

describe("Number transformations", () => {
    it(`must transform numbers to same numbers.`, () => {
        chai.expect(transformer.transform(5, Number)).to.be.equal(5);
        chai.expect(transformer.transform(-5.5, Number)).to.be.equal(-5.5);
        chai.expect(transformer.transform(0, Number)).to.be.equal(0);
        chai.expect(transformer.transform(-0.0, Number)).to.be.equal(-0.0);
        chai.expect(transformer.transform(+0.0, Number)).to.be.equal(+0.0);
        chai.expect(isNaN(transformer.transform<number>(NaN, Number))).to.be.equal(true);
        chai.expect(isNaN(transformer.transform<number>(+NaN, Number))).to.be.equal(true);
        chai.expect(isNaN(transformer.transform<number>(-NaN, Number))).to.be.equal(true);
    });

    it(`must transform strings with numbers only to appropriate numbers.`, () => {
        chai.expect(transformer.transform("5", Number)).to.be.equal(5);
        chai.expect(transformer.transform("-5.5", Number)).to.be.equal(-5.5);
        chai.expect(transformer.transform("0", Number)).to.be.equal(0);
        chai.expect(transformer.transform("-0.0", Number)).to.be.equal(-0.0);
        chai.expect(transformer.transform("+0.0", Number)).to.be.equal(+0.0);
        chai.expect(isNaN(transformer.transform<number>("NaN", Number))).to.be.equal(true);
        chai.expect(isNaN(transformer.transform<number>("+NaN", Number))).to.be.equal(true);
        chai.expect(isNaN(transformer.transform<number>("-NaN", Number))).to.be.equal(true);
    });

    it(`must transform string "null" and "undefined" to "0".`, () => {
        chai.expect(transformer.transform<number>(null, Number)).to.be.equal(0);
        chai.expect(transformer.transform<number>(undefined, Number)).to.be.equal(0);
    });

    it(`must fail transforming strings that not contain numbers.`, () => {
        chai.assert.throws(() => transformer.transform("test", Number));
        chai.assert.throws(() => transformer.transform("", Number));
        chai.assert.throws(() => transformer.transform("\u00F8", Number));
        chai.assert.throws(() => transformer.transform("❤", Number));
        chai.assert.throws(() => transformer.transform("✿", Number));
    });

    it(`must fail transforming strings that contain numbers and other symbols.`, () => {
        chai.assert.throws(() => transformer.transform("0test", Number));
        chai.assert.throws(() => transformer.transform("test2", Number));
        chai.assert.throws(() => transformer.transform("655\u00F824", Number));
        chai.assert.throws(() => transformer.transform("2❤4", Number));
        chai.assert.throws(() => transformer.transform("5✿6", Number));
    });

    it(`must fail transforming other values: objects, arrays, functions`, () => {
        chai.assert.throws(() => transformer.transform(new Date(), Number));
        chai.assert.throws(() => transformer.transform([2, 4], Number));
        chai.assert.throws(() => transformer.transform(Symbol(5), Number));
        chai.assert.throws(() => transformer.transform(new Buffer(42), Number));
        chai.assert.throws(() => transformer.transform(new Error(), Number));
        chai.assert.throws(() => transformer.transform(new Function(), Number));
    });
});