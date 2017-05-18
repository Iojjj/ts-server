import {DecoratorUtils} from "../../../internal/type-transformation/decorator.utils";

export function TypedClass(): ClassDecorator {
    return function (target: Function) {
        DecoratorUtils.decorateClass(target);
    };
}