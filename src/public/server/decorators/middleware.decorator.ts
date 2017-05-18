import {DecoratorUtils} from "../../../internal/server/decorators/utils/decorator.utils";

export function Middleware(): ClassDecorator {
    return function (target: Function) {
        DecoratorUtils.checkIfMiddlewareAndThrow(target);
        DecoratorUtils.decorateMiddleware(target);
    };
}