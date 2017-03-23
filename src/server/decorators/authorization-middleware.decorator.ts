import {DecoratorUtils} from "./internal/utils/decorator.utils";

export function AuthorizationHandlerMiddleware(): ClassDecorator {
    return function (target: Function) {
        DecoratorUtils.checkIfMiddlewareAndThrow(target);
        DecoratorUtils.decorateAuthorizationHandlerMiddleware(target);
    };
}