import {isObject, isString} from "util";
import {DecoratorUtils} from "../../../internal/type-transformation/decorator.utils";
import {TransformerContext} from "../models/abs.type-transformer.context";
import {TransformType} from "../models/transform-type";
import {Transformer} from "./abs.transformer";

export class TypedClassTransformer extends Transformer<any> {

    public transform(context: TransformerContext, val: Object, ...types: TransformType<any>[]): any {
        if (types.length < 1) {
            throw new Error(`Types length: ${types.length}.`);
        }
        const type = types[0];
        if (DecoratorUtils.isTypedClass(type.baseType)) {
            return this.transformTypedClass(context, val, type);
        }
        if (type.baseType === Object && val instanceof Object) {
            return val;
        }
        throw new Error(`Can't transform to ${type.baseType.name}.`);
    }

    private transformTypedClass<T>(context: TransformerContext, plainObj: Object, type: TransformType<T>): T {
        if (plainObj instanceof type.baseType) {
            return plainObj as T;
        }
        if (!isObject(plainObj)) {
            if (isString(plainObj)) {
                plainObj = JSON.parse(plainObj as string);
            } else {
                throw new Error(`Can't transform to ${type.baseType.name}.`);
            }
        }
        const metadata = DecoratorUtils.getMetadata(type.baseType);
        const result: any = new (type.baseType as any)();
        if (plainObj instanceof Map) {
            const map = plainObj as Map<any, any>;
            metadata.forEach(m => {
                const prop = map.get(m.propertyName);
                if (prop == null || prop === undefined) {
                    result[m.propertyName] = m.convertableType.defaultValue;
                } else {
                    result[m.propertyName] = context.transform(prop, m.convertableType);
                }
            });
        } else {
            const rec = plainObj as Record<string, any>;
            metadata.forEach(m => {
                const prop = rec[m.propertyName];
                if (prop == null || prop === undefined) {
                    result[m.propertyName] = m.convertableType.defaultValue;
                } else {
                    result[m.propertyName] = context.transform(prop, m.convertableType);
                }
            });
        }
        return result;
    }
}