import {isArray} from "util";
import {TransformerContext} from "../models/abs.type-transformer.context";
import {TransformType} from "../models/transform-type";
import {Transformer} from "./abs.transformer";

export class SetTransformer extends Transformer<Set<any>> {

    public transform(context: TransformerContext, val: Object, ...types: TransformType<any>[]): Set<any> {
        if (!types || types.length < 1) {
            throw new Error('Pass at least one parametric type.');
        }
        const type = types[0];
        let arr: any[] | undefined;
        if (isArray(val)) {
            arr = val as any[];
        } else if (val instanceof Set) {
            arr = Array.from(val);
        }
        if (arr) {
            const array = arr.map(el => context.transform(val, type));
            return new Set(array);
        }
        return Transformer.onCantTransform(val.constructor, Set);
    }

}