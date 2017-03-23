import {StaticMethodDecorator} from "../../decorator-utils/types/decorator-types";
import {DecoratorUtils} from "../internal/decorator.utils";

/**
 * Decorator that modifies provider so it will create only a single instance of dependency.
 */
export function Singleton(): StaticMethodDecorator {

    return function (target: Function, methodName: string) {
        DecoratorUtils.updateProviderMetadata(target, methodName, metadata => metadata.newBuilder()
            .setSingleton(true)
            .build());
    };
}