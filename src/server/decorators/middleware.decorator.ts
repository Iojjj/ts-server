import {DecoratorUtils} from "./internal/utils/decorator.utils";

export function Middleware(): ClassDecorator {
    return function (target: Function) {
        DecoratorUtils.checkIfMiddlewareAndThrow(target);
        DecoratorUtils.decorateMiddleware(target);
    };
}