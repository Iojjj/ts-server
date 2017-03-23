import {MethodOptions} from "../core/models/options/method-options";
import {MethodType} from "../core/models/types/method-type";
import {Route} from "../core/models/types/route.type";
import {DecoratorUtils} from "./internal/utils/decorator.utils";

export function Patch(route?: Route): MethodDecorator;
export function Patch(options?: MethodOptions): MethodDecorator;
export function Patch(options?: MethodOptions | Route): MethodDecorator {

    return function (target: Object, methodName: string) {
        DecoratorUtils.decorateMethod(target, methodName, MethodType.PATCH, options);
    };
}