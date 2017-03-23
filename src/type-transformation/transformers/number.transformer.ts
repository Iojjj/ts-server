import {isNumber, isString} from "util";
import {TransformerContext} from "../models/abs.type-transformer.context";
import {Transformer} from "./abs.transformer";

export class NumberTransformer extends Transformer<Number> {

    public transform(context: TransformerContext, plainObject: Object): Number {
        if (isNumber(plainObject)) {
            if (isNaN(plainObject as number)) {
                return NaN;
            }
            return Number(plainObject);
        }
        if (isString(plainObject)) {
            if (plainObject === "NaN" || plainObject === "+NaN" || plainObject === "-NaN") {
                return NaN;
            }
            const num = Number(plainObject);
            if (!isNaN(num) && plainObject !== "") {
                return num;
            }
        }
        return Transformer.onCantTransform(plainObject.constructor, Number);
    }

}