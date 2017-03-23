import {isBoolean, isNumber, isString} from "util";
import {TransformerContext} from "../models/abs.type-transformer.context";
import {Transformer} from "./abs.transformer";

export class BooleanTransformer extends Transformer<boolean> {

    public transform(context: TransformerContext, plainObject: Object): boolean {
        if (isBoolean(plainObject)) {
            return Boolean(plainObject);
        }
        if (isString(plainObject)) {
            if (plainObject === "true" || plainObject === "false") {
                return plainObject === "true";
            }
            if (plainObject === "1" || plainObject === "0") {
                return plainObject === "1";
            }
        }
        if (isNumber(plainObject) && !isNaN(plainObject as number) && (plainObject === 1 || plainObject === 0)) {
            return plainObject === 1;
        }
        return Transformer.onCantTransform(plainObject.constructor, Boolean);
    }
}