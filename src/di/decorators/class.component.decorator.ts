import {DecoratorUtils} from "../internal/decorator.utils";

/**
 * Decorator for classes that want some of the dependencies to be injected.
 * @param firstModule first module that provide dependencies
 * @param modules list of other modules that provide dependencies
 */
export function Component(firstModule: Function, ...modules: Function[]): ClassDecorator {
    return function (target: Function) {
        modules = [firstModule, ...modules];
        DecoratorUtils.defineInjector(target, modules);
    };
}