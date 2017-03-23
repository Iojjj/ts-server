import {DecoratorUtils} from "../internal/decorator.utils";

/**
 * Decorator that modifies property only when it's accessed first time.
 */
export function Lazy(): PropertyDecorator {
    return function (target: Object, propertyName: string, index?: number) {
        if (typeof index === "number") {
            if (typeof target === "function" && !propertyName) {
                throw new Error(`${(target as Function).constructor.name}.constructor: ` +
                    `Lazy decorator can't be applied to parameters.`);
            }
            throw new Error(`${target.constructor.name}.${propertyName}: `
                + `Lazy decorator can't be applied to parameters.`);
        }
        DecoratorUtils.updatePropertyMetadata(target, propertyName, metadata => metadata.newBuilder()
            .setLazy(true)
            .build());
    };
}