import {isDate, isNumber, isString} from "util";
import {TransformerContext} from "../models/abs.type-transformer.context";
import {Transformer} from "./abs.transformer";

export class DateTransformer extends Transformer<Date> {

    public transform(context: TransformerContext, plainObject: Object): Date {
        if (isDate(plainObject)) {
            return plainObject as Date;
        }
        if (isNumber(plainObject) && !isNaN(plainObject as number) && plainObject >= 0) {
            return new Date(plainObject as number);
        }
        if (isString(plainObject)) {
            const ms = Date.parse(plainObject as string);
            if (!isNaN(ms)) {
                return new Date(ms);
            }
        }
        return Transformer.onCantTransform(plainObject.constructor, Date);
    }
}