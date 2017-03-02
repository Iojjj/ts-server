import {TypeTransformer} from "../../src/type-transformer/type.transformer";
import {Inject} from "../../src/di/decorators/inject/inject.decorator";
import {Component} from "../../src/di/decorators/component/component.decorator";
import {AbstractTest} from "./abstract.test";
import {TestModule} from "./test.module";
import chai = require("chai");

@Component(TestModule)
export class BooleanTransformTest extends AbstractTest {

    public run(@Inject() typeTransformer?: TypeTransformer): void {
        if (!typeTransformer) {
            return;
        }
        describe("to Boolean", () => {
            it(`must transform string "true" and "false" to true and false respectively`, () => {
                chai.expect(typeTransformer.transform("true", Boolean)).to.be.equal(true);
                chai.expect(typeTransformer.transform("false", Boolean)).to.be.equal(false);
            });

            it(`must fail transforming other strings (non-null and non-undefined)`, () => {
                chai.assert.throws(() => typeTransformer.transform("test", Boolean));
                chai.assert.throws(() => typeTransformer.transform("", Boolean));
                chai.assert.throws(() => typeTransformer.transform("\u00F8", Boolean));
            });

            it(`must transform number 1 and 0 to true and false respectively`, () => {
                chai.expect(typeTransformer.transform(1, Boolean)).to.be.equal(true);
                chai.expect(typeTransformer.transform(1.0, Boolean)).to.be.equal(true);
                chai.expect(typeTransformer.transform(+1, Boolean)).to.be.equal(true);
                chai.expect(typeTransformer.transform(+1.0, Boolean)).to.be.equal(true);
                chai.expect(typeTransformer.transform(0, Boolean)).to.be.equal(false);
                chai.expect(typeTransformer.transform(+0, Boolean)).to.be.equal(false);
                chai.expect(typeTransformer.transform(+0.0, Boolean)).to.be.equal(false);
                chai.expect(typeTransformer.transform(+0.0, Boolean)).to.be.equal(false);
                chai.expect(typeTransformer.transform(-0, Boolean)).to.be.equal(false);
                chai.expect(typeTransformer.transform(-0.0, Boolean)).to.be.equal(false);
                chai.expect(typeTransformer.transform(+0.0, Boolean)).to.be.equal(false);
            });

            it(`must fail transform other numbers to boolean`, () => {
                chai.assert.throws(() => typeTransformer.transform(-1, Boolean));
                chai.assert.throws(() => typeTransformer.transform(532, Boolean));
                chai.assert.throws(() => typeTransformer.transform(5.32, Boolean));
                chai.assert.throws(() => typeTransformer.transform(-5.32, Boolean));
                chai.assert.throws(() => typeTransformer.transform(NaN, Boolean));
                chai.assert.throws(() => typeTransformer.transform(-NaN, Boolean));
                chai.assert.throws(() => typeTransformer.transform(+NaN, Boolean));
            });

            it(`must handle null and undefined and return appropriate values`, () => {
                chai.expect(typeTransformer.transform(null, Boolean)).to.be.equal(null);
                chai.expect(typeTransformer.transform(undefined, Boolean)).to.be.equal(undefined);
            });

            it(`must transform null and undefined to provided null and undefined appropriate values`, () => {
                chai.expect(typeTransformer.transform(null, Boolean, true)).to.be.equal(true);
                chai.expect(typeTransformer.transform(null, Boolean, 0)).to.be.equal(false);
                chai.expect(typeTransformer.transform(null, Boolean, 1)).to.be.equal(true);
                chai.expect(typeTransformer.transform(null, Boolean, "true")).to.be.equal(true);
                chai.expect(typeTransformer.transform(null, Boolean, "false")).to.be.equal(false);
                chai.expect(typeTransformer.transform(undefined, Boolean, true, false)).to.be.equal(false);
                chai.expect(typeTransformer.transform(undefined, Boolean, 0, 0)).to.be.equal(false);
                chai.expect(typeTransformer.transform(undefined, Boolean, 1, 1)).to.be.equal(true);
                chai.expect(typeTransformer.transform(undefined, Boolean, "false", "true")).to.be.equal(true);
                chai.expect(typeTransformer.transform(undefined, Boolean, "true", "false")).to.be.equal(false);
            });

            it(`must fail transforming not appropriate values`, () => {
                chai.assert.throws(() => typeTransformer.transform(5, Boolean));
                chai.assert.throws(() => typeTransformer.transform("", Boolean));
                chai.assert.throws(() => typeTransformer.transform("test", Boolean));
                chai.assert.throws(() => typeTransformer.transform({}, Boolean));
                chai.assert.throws(() => typeTransformer.transform([5, 4], Boolean));
                chai.assert.throws(() => typeTransformer.transform(new Function(), Boolean));
                chai.assert.throws(() => typeTransformer.transform(new Buffer("42"), Boolean));
                chai.assert.throws(() => typeTransformer.transform(Symbol.for("42"), Boolean));
                chai.assert.throws(() => typeTransformer.transform(new Date(), Boolean));
                chai.assert.throws(() => typeTransformer.transform(new Error(), Boolean));
            });

            it(`must fail transforming null and undefined to provided values that can't be transformed to boolean`,
                () => {
                    chai.assert.throws(() => typeTransformer.transform(null, Boolean, 5));
                    chai.assert.throws(() => typeTransformer.transform(null, Boolean, ""));
                    chai.assert.throws(() => typeTransformer.transform(null, Boolean, "test"));
                    chai.assert.throws(() => typeTransformer.transform(null, Boolean, {}));
                    chai.assert.throws(() => typeTransformer.transform(null, Boolean, [5, 4]));
                    chai.assert.throws(() => typeTransformer.transform(null, Boolean, new Function()));
                    chai.assert.throws(() => typeTransformer.transform(null, Boolean, new Buffer("42")));
                    chai.assert.throws(() => typeTransformer.transform(null, Boolean, Symbol.for("42")));
                    chai.assert.throws(() => typeTransformer.transform(null, Boolean, new Date()));
                    chai.assert.throws(() => typeTransformer.transform(null, Boolean, new Error()));
                    chai.assert.throws(() => typeTransformer.transform(undefined, Boolean, 5, 4));
                    chai.assert.throws(() => typeTransformer.transform(undefined, Boolean, "", ""));
                    chai.assert.throws(() => typeTransformer.transform(undefined, Boolean, "test", "test"));
                    chai.assert.throws(() => typeTransformer.transform(undefined, Boolean, {}, {}));
                    chai.assert.throws(() => typeTransformer.transform(undefined, Boolean, [5, 4], [4, 5]));
                    chai.assert.throws(() => typeTransformer.transform(undefined, Boolean, new Function(),
                        new Function()));
                    chai.assert.throws(() => typeTransformer.transform(undefined, Boolean, new Buffer("42"),
                        new Buffer("42")));
                    chai.assert.throws(() => typeTransformer.transform(undefined, Boolean, Symbol.for("42"),
                        Symbol.for("42")));
                    chai.assert.throws(() => typeTransformer.transform(undefined, Boolean, new Date(), new Date()));
                    chai.assert.throws(() => typeTransformer.transform(undefined, Boolean, new Error(), new Error()));
                });
        });
    }

}