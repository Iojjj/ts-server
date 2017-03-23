import {DecoratorUtils} from "../internal/decorator.utils";

/**
 * Decorator for class that represents a module and provides some dependency injections.
 */
export function Module(): ClassDecorator {
    return function (target: Function) {
        DecoratorUtils.decorateModule(target);
    };
}