import {DecoratorUtils} from "../../../internal/server/decorators/utils/decorator.utils";

export function ErrorHandlerMiddleware(): ClassDecorator {
    return function (target: Function) {
        DecoratorUtils.checkIfMiddlewareAndThrow(target);
        DecoratorUtils.decorateErrorHandlerMiddleware(target);
    };
}