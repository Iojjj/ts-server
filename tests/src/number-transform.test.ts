import {TypeTransformer} from "../../framework/src/type-transformer/type.transformer";
import {Component} from "../../framework/src/dependency-injection/decorators/component/component.decorator";
import {AbstractTest} from "./abstract.test";
import {Inject} from "../../framework/src/dependency-injection/decorators/inject/inject.decorator";
import {TestModule} from "./test.module";
import chai = require("chai");

@Component(TestModule)
export class NumberTransformTest extends AbstractTest {

    public run(@Inject() typeTransformer?: TypeTransformer): void {
        if (!typeTransformer) {
            return;
        }
        describe("to Number", () => {
            it(`must transform string "42" to number 42`, () => {
                chai.expect(typeTransformer.transform("42", Number)).equals(42);
            });

            it(`must transform number 5 to number 5`, () => {
                chai.expect(typeTransformer.transform(5, Number)).equals(5);
            });

            it(`must transform string "NaN" to number NaN`, () => {
                chai.expect(isNaN(typeTransformer.transform<number>("NaN", Number))).equals(true);
            });

            it(`must transform NaN to NaN`, () => {
                chai.expect(isNaN(typeTransformer.transform<number>(NaN, Number))).equals(true);
            });

            it(`must transform null to number 5`, () => {
                chai.expect(typeTransformer.transform(null, Number, 5)).equals(5);
            });

            it(`must transform undefined to number 5`, () => {
                chai.expect(typeTransformer.transform(undefined, Number, 5, 5)).equals(5);
            });

            it(`must transform null to null`, () => {
                chai.expect(typeTransformer.transform(null, Number)).equals(null);
            });

            it(`must transform undefined to undefined`, () => {
                chai.expect(typeTransformer.transform(undefined, Number)).equals(undefined);
            });

            it(`must fail transforming string with symbols different from numbers`, () => {
                chai.assert.throws(() => typeTransformer.transform("dada", Number));
            });

            it(`must fail transforming object`, () => {
                chai.assert.throws(() => typeTransformer.transform({}, Number));
            });

            it(`must fail transforming function`, () => {
                chai.assert.throws(() => {
                    typeTransformer.transform(() => {
                        // no-op
                    }, Number);
                });
            });

            it(`must fail transforming Symbol`, () => {
                chai.assert.throws(() => typeTransformer.transform(Symbol(42), Number));
            });

            it(`must fail transforming Buffer`, () => {
                chai.assert.throws(() => typeTransformer.transform(new Buffer("42"), Number));
            });

            it(`must fail transforming array`, () => {
                chai.assert.throws(() => typeTransformer.transform([], Number));
            });
        });
    }
}