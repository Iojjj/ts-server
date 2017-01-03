import {Decorator} from "./decorator";
import {RouteType} from "./http-method.decorators";
import {HttpMethodMetadata} from "./http-method.metadata";

export function Controller(route?: string): Function;
export function Controller(route?: RegExp): Function;
export function Controller(route?: string|RegExp): Function {
    return Decorator.defineController({
        route: route || "",
        actions: []
    });
}

export interface ControllerDecoratorOptions {

    readonly route: RouteType;
    readonly actions: HttpMethodMetadata[];
}