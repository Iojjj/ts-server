import {ClassTransformer} from "../src/utils/class.transformer";
import chai = require("chai");

const classTransformer = new ClassTransformer();

describe("transform to Number", () => {
    it(`must transform string "42" to number 42`, () => {
        chai.expect(classTransformer.transform("42", Number)).equals(42);
    });

    it(`must transform number 5 to number 5`, () => {
        chai.expect(classTransformer.transform(5, Number)).equals(5);
    });

    it(`must transform string "NaN" to number NaN`, () => {
        chai.expect(isNaN(classTransformer.transform("NaN", Number))).equals(true);
    });

    it(`must transform NaN to NaN`, () => {
        chai.expect(isNaN(classTransformer.transform(NaN, Number))).equals(true);
    });

    it(`must fail transforming string with symbols different from numbers`, () => {
        chai.assert.throws(() => classTransformer.transform("dada", Number));
    });

    it(`must fail transforming null`, () => {
        chai.assert.throws(() => classTransformer.transform(null, Number));
    });

    it(`must transform null to number 5`, () => {
        chai.expect(classTransformer.transform(null, Number, 5)).equals(5);
    });

    it(`must transform undefined to number 5`, () => {
        chai.expect(classTransformer.transform(undefined, Number, 5, 5)).equals(5);
    });

    it(`must fail transforming undefined`, () => {
        chai.assert.throws(() => classTransformer.transform(undefined, Number));
    });

    it(`must fail transforming object`, () => {
        chai.assert.throws(() => classTransformer.transform({}, Number));
    });

    it(`must fail transforming function`, () => {
        chai.assert.throws(() => {
            classTransformer.transform(() => {
            }, Number);
        });
    });

    it(`must fail transforming Symbol`, () => {
        chai.assert.throws(() => classTransformer.transform(Symbol(42), Number));
    });

    it(`must fail transforming Buffer`, () => {
        chai.assert.throws(() => classTransformer.transform(new Buffer("42"), Number));
    });
});

describe("transform to String", () => {
    it(`must transform string "aa" to string "aa"`, () => {
        chai.expect(classTransformer.transform("aa", String)).equals("aa");
    });

    it(`must transform boolean true to string "true"`, () => {
        chai.expect(classTransformer.transform(true, String)).equals("true");
    });

    it(`must transform boolean false to string "false"`, () => {
        chai.expect(classTransformer.transform(false, String)).equals("false");
    });

    it(`must transform number 42 to string "42"`, () => {
        chai.expect(classTransformer.transform(42, String)).equals("42");
    });

    it(`must transform number -1 to string "-1"`, () => {
        chai.expect(classTransformer.transform(-1, String)).equals("-1");
    });

    it(`must transform Buffer("42") to string "42"`, () => {
        chai.expect(classTransformer.transform(new Buffer("42"), String)).equals("42");
    });

    it(`must transform null to null`, () => {
        chai.expect(classTransformer.transform(null, String)).equals(null);
    });

    it(`must transform undefined to undefined`, () => {
        chai.expect(classTransformer.transform(undefined, String)).equals(undefined);
    });

    it(`must transform null to "aa"`, () => {
        chai.expect(classTransformer.transform(null, String, "aa")).equals("aa");
    });

    it(`must transform undefined to "aa"`, () => {
        chai.expect(classTransformer.transform(undefined, String, "", "aa")).equals("aa");
    });

    it(`must fail transforming object`, () => {
        chai.assert.throws(() => classTransformer.transform({}, String));
    });

    it(`must fail transforming function`, () => {
        chai.assert.throws(() => {
            classTransformer.transform(() => {
            }, String);
        });
    });

    it(`must fail transforming Symbol`, () => {
        chai.assert.throws(() => classTransformer.transform(Symbol(42), String));
    });
});

describe("transform to Boolean", () => {
    it(`must transform string "true" to true`, () => {
        chai.expect(classTransformer.transform("true", Boolean)).equals(true);
    });
    it(`must transform string "false" to false`, () => {
        chai.expect(classTransformer.transform("false", Boolean)).equals(false);
    });
    it(`must transform number 1 to true`, () => {
        chai.expect(classTransformer.transform(1, Boolean)).equals(true);
    });
    it(`must transform number 0 to false`, () => {
        chai.expect(classTransformer.transform(0, Boolean)).equals(false);
    });
    it(`must fail transform number -1 to boolean`, () => {
        chai.assert.throws(() => classTransformer.transform(-1, Boolean));
    });

    it(`must transform null to null`, () => {
        chai.expect(classTransformer.transform(null, Boolean)).equals(null);
    });

    it(`must transform undefined to undefined`, () => {
        chai.expect(classTransformer.transform(undefined, Boolean)).equals(undefined);
    });

    it(`must transform null to true`, () => {
        chai.expect(classTransformer.transform(null, Boolean, true)).equals(true);
    });

    it(`must transform undefined to false`, () => {
        chai.expect(classTransformer.transform(undefined, Boolean, true, false)).equals(false);
    });

    it(`must fail transforming object`, () => {
        chai.assert.throws(() => classTransformer.transform({}, Boolean));
    });

    it(`must fail transforming function`, () => {
        chai.assert.throws(() => {
            classTransformer.transform(() => {
            }, Boolean);
        });
    });

    it(`must fail transforming Symbol`, () => {
        chai.assert.throws(() => classTransformer.transform(Symbol(42), Boolean));
    });
});