import {TypeTransformer} from "../../framework/src/type-transformer/type.transformer";
import {Component} from "../../framework/src/dependency-injection/decorators/component/component.decorator";
import {AbstractTest} from "./abstract.test";
import {Inject} from "../../framework/src/dependency-injection/decorators/inject/inject.decorator";
import {TestModule} from "./test.module";
import chai = require("chai");

@Component(TestModule)
export class StringTransformTest extends AbstractTest {

    public run(@Inject() typeTransformer?: TypeTransformer): void {
        if (!typeTransformer) {
            return;
        }
        describe("to String", () => {
            it(`must transform string "aa" to string "aa"`, () => {
                chai.expect(typeTransformer.transform("aa", String)).equals("aa");
            });

            it(`must transform boolean true to string "true"`, () => {
                chai.expect(typeTransformer.transform(true, String)).equals("true");
            });

            it(`must transform boolean false to string "false"`, () => {
                chai.expect(typeTransformer.transform(false, String)).equals("false");
            });

            it(`must transform number 42 to string "42"`, () => {
                chai.expect(typeTransformer.transform(42, String)).equals("42");
            });

            it(`must transform number -1 to string "-1"`, () => {
                chai.expect(typeTransformer.transform(-1, String)).equals("-1");
            });

            it(`must transform Buffer("42") to string "42"`, () => {
                chai.expect(typeTransformer.transform(new Buffer("42"), String)).equals("42");
            });

            it(`must transform null to null`, () => {
                chai.expect(typeTransformer.transform(null, String)).equals(null);
            });

            it(`must transform undefined to undefined`, () => {
                chai.expect(typeTransformer.transform(undefined, String)).equals(undefined);
            });

            it(`must transform null to "aa"`, () => {
                chai.expect(typeTransformer.transform(null, String, "aa")).equals("aa");
            });

            it(`must transform undefined to "aa"`, () => {
                chai.expect(typeTransformer.transform(undefined, String, "", "aa")).equals("aa");
            });

            it(`must fail transforming object`, () => {
                chai.assert.throws(() => typeTransformer.transform({}, String));
            });

            it(`must fail transforming function`, () => {
                chai.assert.throws(() => {
                    typeTransformer.transform(() => {
                        // no-op
                    }, String);
                });
            });

            it(`must fail transforming Symbol`, () => {
                chai.assert.throws(() => typeTransformer.transform(Symbol(42), String));
            });

            it(`must fail transforming array`, () => {
                chai.assert.throws(() => typeTransformer.transform([], String));
            });
        });
    }
}