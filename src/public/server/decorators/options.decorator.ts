import {MethodOptions} from "../core/models/options/method-options";
import {MethodType} from "../core/models/types/method-type";
import {Route} from "../core/models/types/route.type";
import {DecoratorUtils} from "../../../internal/server/decorators/utils/decorator.utils";

export function Options(route?: Route): MethodDecorator;
export function Options(options?: MethodOptions): MethodDecorator;
export function Options(options?: MethodOptions | Route): MethodDecorator {

    return function (target: Object, methodName: string) {
        DecoratorUtils.decorateMethod(target, methodName, MethodType.OPTIONS, options);
    };
}