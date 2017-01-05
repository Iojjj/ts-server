import {DecoratorFactory} from "./decorator.factory";

/**
 * Decorator that tells server that response must be returned to client without formatting.
 * @return {(target:Object, methodName:string, descriptor:PropertyDescriptor)=>void}
 */
export function RawResponse() {
    return function (target: Object, methodName: string, descriptor: PropertyDescriptor) {
        DecoratorFactory.newResponseTypeDecoratorService().define(target, methodName, descriptor, "raw");
    }
}

/**
 * Decorator that tells server that response must be returned to client in JSON format.
 * @return {(target:Object, methodName:string, descriptor:PropertyDescriptor)=>void}
 */
export function JsonResponse() {
    return function (target: Object, methodName: string, descriptor: PropertyDescriptor) {
        DecoratorFactory.newResponseTypeDecoratorService().define(target, methodName, descriptor, "json");
    }
}

/**
 * Decorator that tells server that response must be returned to client in JSON format with support of JSON-P.
 * @return {(target:Object, methodName:string, descriptor:PropertyDescriptor)=>void}
 */
export function JsonPResponse() {
    return function (target: Object, methodName: string, descriptor: PropertyDescriptor) {
        DecoratorFactory.newResponseTypeDecoratorService().define(target, methodName, descriptor, "jsonp");
    }
}