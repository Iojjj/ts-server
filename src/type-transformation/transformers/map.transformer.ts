import {TransformerContext} from "../models/abs.type-transformer.context";
import {TransformType} from "../models/transform-type";
import {Transformer} from "./abs.transformer";

export class MapTransformer extends Transformer<Map<any, any>> {

    public transform(context: TransformerContext, val: Object, ...types: TransformType<any>[]): Map<any, any> {
        if (!types || types.length < 2) {
            throw new Error('Pass at least two parametric type.');
        }
        const keyType = types[0];
        const valueType = types[1];
        const keys: any[] = [];
        const values: any[] = [];
        if (val instanceof Map) {
            val.forEach((v, k) => {
                keys.push(k);
                values.push(v);
            });
        } else {
            for (const key in val) {
                keys.push(key);
                values.push((val as any)[key]);
            }
        }
        const map = new Map();
        for (let i = 0; i < keys.length; i++) {
            const k = context.transform(keys[i], keyType);
            const v = context.transform(values[i], valueType);
            map.set(k, v);
        }
        return map;
    }

}