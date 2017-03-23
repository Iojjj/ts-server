import {isArray} from "util";
import {TransformerContext} from "../models/abs.type-transformer.context";
import {TransformType} from "../models/transform-type";
import {Transformer} from "./abs.transformer";

export class ArrayTransformer extends Transformer<Array<any>> {

    public transform(context: TransformerContext, val: Object, ...types: TransformType<any>[]): Array<any> {
        if (!types || types.length < 1) {
            throw new Error('Pass at least one type.');
        }
        const type = types[0];
        let arr: any[] | undefined;
        if (isArray(val)) {
            arr = val as any[];
        } else if (val instanceof Set) {
            arr = Array.from(val);
        }
        if (arr) {
            return arr.map(el => context.transform(el, type));
        }
        return Transformer.onCantTransform(val.constructor, Array);
    }

}