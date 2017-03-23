import {CreatableType} from "../../decorator-utils/types/creatable.type";
import {DecoratorUtils} from "../internal/decorator.utils";

/**
 * Decorator that specifies a qualifier name or type for injectable property.
 * It helps the system to understand which of providers to use if there are multiple matches for the same property
 * or parameter type.
 * @param qualifier name or type for injectable property or parameter
 */
export function Named(qualifier: string | CreatableType) {
    return function (target: Object, propertyName: string, index?: number) {
        if (typeof index === "number") {
            if (typeof target === "function" && !propertyName) {
                throw new Error(`${(target as Function).name}.constructor: ` +
                    `Named decorator can't be applied to parameters.`);
            }
            throw new Error(`${target.constructor.name}.${propertyName}: `
                + `Named decorator can't be applied to parameters.`);
        }
        if (!qualifier) {
            throw new Error(`${target.constructor.name}.${propertyName}: You must specify qualifier.`);
        }
        // inject property
        DecoratorUtils.updatePropertyMetadata(target, propertyName, metadata => metadata.newBuilder()
            .setQualifier(qualifier)
            .build());
    };
}