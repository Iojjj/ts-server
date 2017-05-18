import {DecoratorUtils} from "../../../internal/server/decorators/utils/decorator.utils";

export function AuthorizationHandlerMiddleware(): ClassDecorator {
    return function (target: Function) {
        DecoratorUtils.checkIfMiddlewareAndThrow(target);
        DecoratorUtils.decorateAuthorizationHandlerMiddleware(target);
    };
}