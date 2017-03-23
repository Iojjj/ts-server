import {isBoolean, isBuffer, isNumber, isString} from "util";
import {TransformerContext} from "../models/abs.type-transformer.context";
import {Transformer} from "./abs.transformer";

export class StringTransformer extends Transformer<string> {

    public transform(context: TransformerContext, plainObject: Object): string {
        if (isString(plainObject)) {
            return plainObject as string;
        }
        if (isNumber(plainObject)) {
            return String(plainObject);
        }
        if (isBuffer(plainObject) || isBoolean(plainObject)) {
            return String(plainObject);
        }
        return Transformer.onCantTransform(plainObject.constructor, String);
    }

}