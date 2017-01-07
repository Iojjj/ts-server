import {TransformMetadata} from "./transform.metadata";

export function Transform(nullValue?: any, undefinedValue?: any) {
    return function (target: Object, methodName: string) {
        const returnType = Reflect.getMetadata("design:type", target, methodName);
        if (returnType === Array || returnType === Set) {
            throw new Error(`You must use @TransformCollection decorator for Array and Set.`);
        }
        if (returnType === Map) {
            throw new Error(`You must use @TransformDictionary decorator for Map.`);
        }
        const metadata: TransformMetadata = {
            nullValue: nullValue,
            undefinedValue: undefinedValue
        };
        Reflect.defineMetadata(`__metadata_transform_${methodName}__`, metadata, target.constructor, methodName);
    }
}

export function TransformCollection(valueType: Function, nullValue?: any, undefinedValue?: any) {
    return function (target: Object, methodName: string) {
        const returnType = Reflect.getMetadata("design:type", target, methodName);
        if (returnType === Map) {
            throw new Error(`You must use @TransformDictionary decorator for Map.`);
        }
        if (returnType !== Array && returnType !== Set) {
            throw new Error(`You must use @Transform decorator for simple objects.`);
        }
        const metadata: TransformMetadata = {
            type1: valueType,
            nullValue: nullValue,
            undefinedValue: undefinedValue
        };
        Reflect.defineMetadata(`__metadata_transform_${methodName}__`, metadata, target.constructor, methodName);
    }
}

export function TransformDictionary(keyType: Function, valueType: Function, nullValue?: any, undefinedValue?: any) {
    return function (target: Object, methodName: string) {
        const returnType = Reflect.getMetadata("design:type", target, methodName);
        if (returnType === Array || returnType === Set) {
            throw new Error(`You must use @TransformCollection decorator for Array and Set.`);
        }
        if (returnType !== Map) {
            throw new Error(`You must use @Transform decorator for simple objects.`);
        }
        const metadata: TransformMetadata = {
            type1: keyType,
            type2: valueType,
            nullValue: nullValue,
            undefinedValue: undefinedValue
        };
        Reflect.defineMetadata(`__metadata_transform_${methodName}__`, metadata, target.constructor, methodName);
    }
}