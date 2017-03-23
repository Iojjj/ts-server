import {CreatableType} from "../../decorator-utils/types/creatable.type";
import {DecoratorUtils} from "../internal/decorator.utils";
import {TypeUtils} from "../internal/type.utils";
import {TypedMetadataBuilder} from "../internal/typed-metadata.builder";
import {TransformType} from "../models/transform-type";

export function TypedMap(type: TransformType<any>): PropertyDecorator;
export function TypedMap(keyType: CreatableType, valueType: CreatableType): PropertyDecorator;
export function TypedMap(keyType: TransformType<any>, valueType: TransformType<any>): PropertyDecorator;
export function TypedMap(keyType: CreatableType | TransformType<any>,
                         valueType?: CreatableType | TransformType<any>): PropertyDecorator {
    return function (target: Object, propertyName: string) {
        TypeUtils.checkAndThrowIfNot(target, propertyName, Map);
        let convertableType: TransformType<any>;
        if (keyType instanceof TransformType && !valueType) {
            if (keyType.baseType !== Map) {
                throw new Error(`You must set base type to Map.`);
            }
            convertableType = keyType;
        } else if (keyType instanceof TransformType && valueType instanceof TransformType) {
            convertableType = TransformType.map(keyType, valueType);
        } else if (!!valueType) {
            if (keyType === Array || keyType === Set || keyType === Map) {
                throw new Error(`You must set a simple type for key type. `
                    + `If you need to transform array of array or any other `
                    + `combination of types, pass an instance of ${TransformType.name}.`);
            }
            if (valueType === Array || valueType === Set || valueType === Map) {
                throw new Error(`You must set a simple type for value type. `
                    + `If you need to transform array of array or any other `
                    + `combination of types, pass an instance of ${TransformType.name}.`);
            }
            convertableType = TransformType.map(keyType as CreatableType, valueType as CreatableType);
        } else {
            throw new Error(`Invalid type arguments. You can pass only an instance of ${TransformType.name}, `
                + `or pairs of CreatableType or ${TransformType.name}.`);
        }
        const metadata = new TypedMetadataBuilder()
            .setConvertableType(convertableType)
            .build();
        DecoratorUtils.decorateProperty(target, propertyName, metadata);
    };
}