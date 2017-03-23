import {MethodOptions} from "../core/models/options/method-options";
import {MethodType} from "../core/models/types/method-type";
import {Route} from "../core/models/types/route.type";
import {DecoratorUtils} from "./internal/utils/decorator.utils";

export function Delete(route?: Route): MethodDecorator;
export function Delete(options?: MethodOptions): MethodDecorator;
export function Delete(options?: MethodOptions | Route): MethodDecorator {

    //noinspection JSUnusedLocalSymbols
    return function (target: Object, methodName: string, descriptor: PropertyDescriptor) {
        DecoratorUtils.decorateMethod(target, methodName, MethodType.DELETE, options);
    };
}