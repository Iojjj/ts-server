import {TypeTransformer} from "../../src/type-transformer/type.transformer";
import {AbstractTest} from "./abstract.test";
import {Inject} from "../../src/di/decorators/inject/inject.decorator";
import {Component} from "../../src/di/decorators/component/component.decorator";
import {TestModule} from "./test.module";
import chai = require("chai");

@Component(TestModule)
export class DateTransformTest extends AbstractTest {

    public run(@Inject() typeTransformer?: TypeTransformer): void {
        if (!typeTransformer) {
            return;
        }
        describe("to Date", () => {
            it("must transform Date to Date", () => {
                const date = new Date(Date.now());
                chai.expect(typeTransformer.transform<Date>(date, Date).getTime()).equals(date.getTime());
            });

            it("must transform number to Date", () => {
                const date = Date.now();
                chai.expect(typeTransformer.transform<Date>(date, Date).getTime()).equals(date);
            });

            it("must transform string in format YYYY to Date", () => {
                const date = new Date(Date.UTC(1990, 0));
                const parsed = typeTransformer.transform<Date>("1990", Date);
                chai.expect(parsed.getTime()).equals(date.getTime());
            });

            it("must transform string in format YYYY-MM to Date", () => {
                const date = new Date(Date.UTC(1990, 1));
                const parsed = typeTransformer.transform<Date>("1990-02", Date);
                chai.expect(parsed.getTime()).equals(date.getTime());
            });

            it("must transform string in format YYYY-MM-DD to Date", () => {
                const date = new Date(Date.UTC(1990, 1, 15, 0, 0, 0, 0));
                const parsed = typeTransformer.transform<Date>("1990-02-15", Date);
                chai.expect(parsed.getTime()).equals(date.getTime());
            });

            it(`must transform null to null`, () => {
                chai.expect(typeTransformer.transform(null, Date)).equals(null);
            });

            it(`must transform undefined to undefined`, () => {
                chai.expect(typeTransformer.transform(undefined, Date)).equals(undefined);
            });

            it(`must transform null to Date.now()`, () => {
                const date = new Date();
                chai.expect(typeTransformer.transform(null, Date, date)).equals(date);
            });

            it(`must transform undefined to 1990-02-15`, () => {
                const date = new Date(Date.UTC(1990, 1, 15, 0, 0, 0, 0));
                chai.expect(typeTransformer.transform(undefined, Date, null, date)).equals(date);
            });

            it("must fail transforming string in wrong format", () => {
                chai.assert.throws(() => typeTransformer.transform<Date>("02-1990", Date));
            });

            it("must fail transforming random string", () => {
                chai.assert.throws(() => typeTransformer.transform<Date>("dwad", Date));
            });

            it("must fail transforming boolean", () => {
                chai.assert.throws(() => typeTransformer.transform<Date>(true, Date));
            });

            it("must fail transforming Buffer", () => {
                chai.assert.throws(() => typeTransformer.transform<Date>(new Buffer("42"), Date));
            });

            it("must fail transforming Symbol", () => {
                chai.assert.throws(() => typeTransformer.transform<Date>(Symbol("42"), Date));
            });

            it("must fail transforming array", () => {
                chai.assert.throws(() => typeTransformer.transform<Date>([], Date));
            });

            it("must fail transforming object", () => {
                chai.assert.throws(() => typeTransformer.transform<Date>({}, Date));
            });

            it("must fail transforming function", () => {
                chai.assert.throws(() => typeTransformer.transform<Date>(() => {
                    // no-op
                }, Date));
            });
        });
    }

}