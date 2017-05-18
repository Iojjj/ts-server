import {MethodOptions} from "../core/models/options/method-options";
import {MethodType} from "../core/models/types/method-type";
import {Route} from "../core/models/types/route.type";
import {DecoratorUtils} from "../../../internal/server/decorators/utils/decorator.utils";

export function Head(route?: Route): MethodDecorator;
export function Head(options?: MethodOptions): MethodDecorator;
export function Head(options?: MethodOptions | Route): MethodDecorator {

    return function (target: Object, methodName: string) {
        DecoratorUtils.decorateMethod(target, methodName, MethodType.HEAD, options);
    };
}