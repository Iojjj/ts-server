import {DecoratorUtils} from "../utils/decorator.utils";

/**
 * Decorator that allows to inject dependencies.
 */
export function Inject(qualifier?: string | number | symbol): PropertyDecorator {
    return function (target: Object, propertyName: string, index?: number) {
        if (typeof index === "number") {
            if (typeof target === "function" && !propertyName) {
                throw new Error(`${(target as Function).constructor.name}.constructor: ` +
                    `Lazy decorator can't be applied to parameters.`);
            }
            throw new Error(`${target.constructor.name}.${propertyName}: `
                + `Lazy decorator can't be applied to parameters.`);
        }
        DecoratorUtils.updatePropertyMetadata(target, propertyName, metadata => {
            let returnType = Reflect.getMetadata("design:type", target, propertyName) as any;
            return metadata.newBuilder()
                .setType(DecoratorUtils.unwrapType(returnType))
                .setQualifier(qualifier ? DecoratorUtils.getQualifier(target, propertyName, qualifier) : undefined)
                .build();
        });
    };
}