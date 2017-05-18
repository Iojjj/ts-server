import {StaticMethodDecorator} from "../../decorator-utils/types/decorator-types";
import {ProvidesMetadata} from "../../../internal/di/metadata/provides-metadata.bean";
import {DecoratorUtils} from "../utils/decorator.utils";

/**
 * Decorator for methods of a module that represent a provider.
 * @param qualifier qualifier name or type for provider that will be used for matching {@link Named}
 */
export function Provides(qualifier?: string | number | symbol): StaticMethodDecorator {

    //noinspection JSUnusedLocalSymbols
    return function (target: Function, methodName: string, descriptor: PropertyDescriptor) {
        const upd = (metadata: ProvidesMetadata) => update(target, methodName, metadata, qualifier);
        DecoratorUtils.updateProviderMetadata(target, methodName, upd);
    };
}

function update(target: Function, methodName: string, metadata: ProvidesMetadata,
                qualifier?: string | number | symbol): ProvidesMetadata {
    let returnType = Reflect.getMetadata("design:returntype", target, methodName);
    if (!returnType) {
        throw new Error(`${target.name}.${methodName}: Returned type can't be "void" or "any".`);
    }
    returnType = DecoratorUtils.unwrapType(returnType);
    if (returnType.name === "Object" || returnType.name === "Function") {
        // interface or anonymous types
        if (!qualifier) {
            throw new Error(`${target.name}.${methodName}: Return type "${returnType.name}" ` +
                `is not a valid return type. You must specify type of end-class or set qualification name.`);
        }

    }
    return metadata.newBuilder()
        .setType(returnType)
        .setQualifier(qualifier ? DecoratorUtils.getQualifier(target, methodName, qualifier) : undefined)
        .setMethod((target as any)[methodName])
        .build();
}