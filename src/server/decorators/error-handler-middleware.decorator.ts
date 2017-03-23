import {DecoratorUtils} from "./internal/utils/decorator.utils";

export function ErrorHandlerMiddleware(): ClassDecorator {
    return function (target: Function) {
        DecoratorUtils.checkIfMiddlewareAndThrow(target);
        DecoratorUtils.decorateErrorHandlerMiddleware(target);
    };
}