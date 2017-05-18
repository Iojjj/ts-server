import {CreatableType} from "../../decorator-utils/types/creatable.type";
import {DecoratorUtils} from "../../../internal/type-transformation/decorator.utils";
import {TypeUtils} from "../../../internal/type-transformation/type.utils";
import {TypedMetadataBuilder} from "../../../internal/type-transformation/typed-metadata.builder";
import {TransformType} from "../models/transform-type";

export function TypedArray(type: CreatableType): PropertyDecorator;
export function TypedArray(type: TransformType<any>): PropertyDecorator;
export function TypedArray(type: CreatableType | TransformType<any>): PropertyDecorator {

    return function (target: Object, propertyName: string) {
        TypeUtils.checkAndThrowIfNot(target, propertyName, Array);
        let convertableType: TransformType<any>;
        if (type instanceof TransformType) {
            if (type.baseType !== Array) {
                throw new Error(`You must set base type to Array.`);
            }
            convertableType = type;
        } else {
            if (type === Array || type === Set || type === Map) {
                throw new Error(`You must set a simple type. If you need to transform array of array or any other `
                    + `combination of types, pass an instance of ${TransformType.name}.`);
            }
            convertableType = TransformType.array(type);
        }
        const metadata = new TypedMetadataBuilder()
            .setConvertableType(convertableType)
            .build();
        DecoratorUtils.decorateProperty(target, propertyName, metadata);
    };
}