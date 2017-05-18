import {ControllerOptions} from "../core/models/options/controller-options";
import {ResponseType} from "../core/models/types/response-type";
import {DecoratorUtils} from "../../../internal/server/decorators/utils/decorator.utils";

/**
 * Decorator that marks a class a controller. Default response type of this controller is RAW.
 * @param options some controller options
 */
export function RawController(options?: ControllerOptions): ClassDecorator {
    return function (target: Function) {
        DecoratorUtils.decorateController(target, ResponseType.RAW, options);
    };
}