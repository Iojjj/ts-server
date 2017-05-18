import {MethodOptions} from "../core/models/options/method-options";
import {MethodType} from "../core/models/types/method-type";
import {Route} from "../core/models/types/route.type";
import {DecoratorUtils} from "../../../internal/server/decorators/utils/decorator.utils";

export function Post(route?: Route): MethodDecorator;
export function Post(options?: MethodOptions): MethodDecorator;
export function Post(options?: MethodOptions | Route): MethodDecorator {

    return function (target: Object, methodName: string) {
        DecoratorUtils.decorateMethod(target, methodName, MethodType.POST, options);
    };
}