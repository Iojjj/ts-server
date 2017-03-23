import {DecoratorUtils} from "../internal/decorator.utils";

export function TypedClass(): ClassDecorator {
    return function (target: Function) {
        DecoratorUtils.decorateClass(target);
    };
}