import {CreatableType} from "../../decorator-utils/types/creatable.type";
import {DecoratorUtils} from "../../../internal/type-transformation/decorator.utils";
import {TypeUtils} from "../../../internal/type-transformation/type.utils";
import {TypedMetadataBuilder} from "../../../internal/type-transformation/typed-metadata.builder";
import {TransformType} from "../models/transform-type";

export function TypedSet(type: CreatableType): PropertyDecorator;
export function TypedSet(type: TransformType<any>): PropertyDecorator;
export function TypedSet(type: CreatableType | TransformType<any>): PropertyDecorator {
    return function (target: Object, propertyName: string) {
        TypeUtils.checkAndThrowIfNot(target, propertyName, Set);
        let convertableType: TransformType<any>;
        if (type instanceof TransformType) {
            if (type.baseType !== Set) {
                throw new Error(`You must set base type to Set.`);
            }
            convertableType = type;
        } else {
            if (type === Array || type === Set || type === Map) {
                throw new Error(`You must set a simple type. If you need to transform array of array or any other `
                    + `combination of types, pass an instance of ${TransformType.name}.`);
            }
            convertableType = TransformType.set(type);
        }
        const metadata = new TypedMetadataBuilder()
            .setConvertableType(convertableType)
            .build();
        DecoratorUtils.decorateProperty(target, propertyName, metadata);
    };
}