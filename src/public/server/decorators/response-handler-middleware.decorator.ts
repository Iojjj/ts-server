import {ResponseType} from "../core/models/types/response-type";
import {DecoratorUtils} from "../../../internal/server/decorators/utils/decorator.utils";

export function ResponseHandlerMiddleware(responseType: ResponseType): ClassDecorator {
    return function (target: Function) {
        DecoratorUtils.checkIfMiddlewareAndThrow(target);
        DecoratorUtils.decorateResponseHandlerMiddleware(target, responseType);
    };
}