import {MethodOptions} from "../core/models/options/method-options";
import {MethodType} from "../core/models/types/method-type";
import {Route} from "../core/models/types/route.type";
import {DecoratorUtils} from "./internal/utils/decorator.utils";

export function Put(route?: Route): MethodDecorator;
export function Put(options?: MethodOptions): MethodDecorator;
export function Put(options?: MethodOptions | Route): MethodDecorator {

    return function (target: Object, methodName: string) {
        DecoratorUtils.decorateMethod(target, methodName, MethodType.PUT, options);
    };
}