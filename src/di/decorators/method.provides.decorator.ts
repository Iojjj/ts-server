import {CreatableType} from "../../decorator-utils/types/creatable.type";
import {StaticMethodDecorator} from "../../decorator-utils/types/decorator-types";
import {DecoratorUtils} from "../internal/decorator.utils";
import {ProvidesMetadata} from "../metadata/provides-metadata.bean";

/**
 * Decorator for methods of a module that represent a provider.
 * @param qualifier qualifier name or type for provider that will be used for matching {@link Named}
 */
export function Provides(qualifier?: string | CreatableType): StaticMethodDecorator {

    //noinspection JSUnusedLocalSymbols
    return function (target: Function, methodName: string, descriptor: PropertyDescriptor) {
        const upd = (metadata: ProvidesMetadata) => update(target, methodName, qualifier, metadata);
        DecoratorUtils.updateProviderMetadata(target, methodName, upd);
    };
}

function update(target: Function, methodName: string, qualifierName: string | CreatableType | undefined,
                metadata: ProvidesMetadata): ProvidesMetadata {
    const returnType = Reflect.getMetadata("design:returntype", target, methodName);
    if (!returnType) {
        throw new Error(`${target.name}.${methodName}: Returned type can't be "void" or "any".`);
    }
    let type: CreatableType;
    if (returnType.name === "Object" || returnType.name === "Function") {
        // interface or anonymous types
        if (!qualifierName) {
            throw new Error(`${target.name}.${methodName}: Return type "${returnType.name}" ` +
                `is not a valid return type. You must specify type of end-class or set qualification name.`);
        }

    }
    return metadata.newBuilder()
        .setType(returnType)
        .setQualifier(qualifierName || "")
        .setMethod((target as any)[methodName])
        .build();
}