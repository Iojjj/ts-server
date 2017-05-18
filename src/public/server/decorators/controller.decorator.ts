import {ControllerOptions} from "../core/models/options/controller-options";
import {ResponseType} from "../core/models/types/response-type";
import {DecoratorUtils} from "../../../internal/server/decorators/utils/decorator.utils";

/**
 * Decorator that marks a class a controller.
 * @param responseType default type of response of methods of this controller
 * @param options some controller options
 */
export function Controller(responseType: ResponseType, options?: ControllerOptions): ClassDecorator {
    return function (target: Function) {
        DecoratorUtils.decorateController(target, responseType, options);
    };
}