import {DecoratorFactory} from "../factory/decorator.factory";
import {ServerOptions} from "./server.options";

/**
 * Decorator that marks class as a HTTP server.
 * @param options various configuration options
 * @return {(target:any)=>void}
 */
export function Server(options?: ServerOptions) {
    return function (target: any) {
        DecoratorFactory.newServerDecoratorService().define(target, options || { defaultResponseType: "raw" });
    };
}