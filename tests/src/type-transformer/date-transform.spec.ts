import chai = require("chai");
import {DefaultTypeTransformer} from "../../../src/type-transformation/models/def.type-transformer";
import {TransformType} from "../../../src/type-transformation/models/transform-type";

const transformer = new DefaultTypeTransformer();

describe("Transform to Date", () => {
    it("must transform Date to Date", () => {
        const date = new Date(Date.now());
        chai.expect(transformer.transform(date, TransformType.DATE).getTime()).equals(date.getTime());
    });

    it("must transform number to Date", () => {
        const date = Date.now();
        chai.expect(transformer.transform<Date>(date, TransformType.DATE).getTime()).equals(date);
    });

    it("must transform string in format YYYY to Date", () => {
        const date = new Date(Date.UTC(1990, 0));
        const parsed = transformer.transform<Date>("1990", TransformType.DATE);
        chai.expect(parsed.getTime()).equals(date.getTime());
    });

    it("must transform string in format YYYY-MM to Date", () => {
        const date = new Date(Date.UTC(1990, 1));
        const parsed = transformer.transform<Date>("1990-02", TransformType.DATE);
        chai.expect(parsed.getTime()).equals(date.getTime());
    });

    it("must transform string in format YYYY-MM-DD to Date", () => {
        const date = new Date(Date.UTC(1990, 1, 15, 0, 0, 0, 0));
        const parsed = transformer.transform<Date>("1990-02-15", TransformType.DATE);
        chai.expect(parsed.getTime()).equals(date.getTime());
    });

    it(`must transform null to UNIX timestamp 0`, () => {
        chai.expect(transformer.transform(null, TransformType.DATE).getTime()).equals(0);
    });

    it(`must transform undefined to UNIX timestamp 0`, () => {
        chai.expect(transformer.transform(undefined, TransformType.DATE).getTime()).equals(0);
    });

    it("must fail transforming string in wrong format", () => {
        chai.assert.throws(() => transformer.transform<Date>("02-1990", TransformType.DATE));
    });

    it("must fail transforming random string", () => {
        chai.assert.throws(() => transformer.transform<Date>("dwad", TransformType.DATE));
    });

    it("must fail transforming boolean", () => {
        chai.assert.throws(() => transformer.transform<Date>(true, TransformType.DATE));
    });

    it("must fail transforming Buffer", () => {
        chai.assert.throws(() => transformer.transform<Date>(new Buffer("42"), TransformType.DATE));
    });

    it("must fail transforming Symbol", () => {
        chai.assert.throws(() => transformer.transform<Date>(Symbol("42"), TransformType.DATE));
    });

    it("must fail transforming array", () => {
        chai.assert.throws(() => transformer.transform<Date>([], TransformType.DATE));
    });

    it("must fail transforming object", () => {
        chai.assert.throws(() => transformer.transform<Date>({}, TransformType.DATE));
    });

    it("must fail transforming function", () => {
        chai.assert.throws(() => transformer.transform<Date>(() => {
            // no-op
        }, TransformType.DATE));
    });
});