import "reflect-metadata";
import {CreatableType} from "../../decorator-utils/types/creatable.type";
import {DecoratorUtils} from "../../../internal/type-transformation/decorator.utils";
import {TypeUtils} from "../../../internal/type-transformation/type.utils";
import {TypedMetadataBuilder} from "../../../internal/type-transformation/typed-metadata.builder";
import {TransformType} from "../models/transform-type";

export function Typed(): PropertyDecorator;
export function Typed(type: CreatableType): PropertyDecorator;
export function Typed(type: TransformType<any>): PropertyDecorator;
export function Typed(type?: CreatableType | TransformType<any>): PropertyDecorator {

    return function (target: Object, propertyName: string) {
        TypeUtils.checkAndThrowIfGeneric(target, propertyName);
        TypeUtils.checkAndThrowIf(target, propertyName, Array, Set, Map);
        let convertableType: TransformType<any>;
        if (!!type) {
            if (type instanceof TransformType) {
                convertableType = type;
            } else {
                convertableType = TransformType.getType(type);
            }
        } else {
            const returnType = Reflect.getMetadata("design:type", target, propertyName);
            convertableType = TransformType.getType(returnType);
        }
        const metadata = new TypedMetadataBuilder()
            .setConvertableType(convertableType)
            .build();
        DecoratorUtils.decorateProperty(target, propertyName, metadata);
    };
}