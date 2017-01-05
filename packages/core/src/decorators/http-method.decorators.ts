import {RouteType, HttpMethodName} from "../server.types";
import {DecoratorFactory} from "./decorator.factory";
import {HttpMethodMetadataImpl} from "./http-method.metadata";

const defineMethod = function (route: RouteType, method: HttpMethodName,
                               target: any, methodName: string, descriptor: PropertyDescriptor) {
    const metadata = new HttpMethodMetadataImpl();
    metadata.route = route;
    metadata.httpMethodName = method;
    return DecoratorFactory.newHttpMethodDecoratorService().define(target, methodName, descriptor, metadata);
};

/**
 * Decorator for GET action.
 * @param route route for action
 * @return {(target:any, methodName:string, descriptor:PropertyDescriptor)=>PropertyDescriptor}
 */
export function HttpGet(route?: RouteType) {
    return function (target: any, methodName: string, descriptor: PropertyDescriptor) {
        return defineMethod(route || "", "get", target, methodName, descriptor);
    }
}

/**
 * Decorator for POST action.
 * @param route route for action
 * @return {(target:any, methodName:string, descriptor:PropertyDescriptor)=>PropertyDescriptor}
 */
export function HttpPost(route?: RouteType) {
    return function (target: any, methodName: string, descriptor: PropertyDescriptor) {
        return defineMethod(route || "", "post", target, methodName, descriptor);
    }
}

/**
 * Decorator for PUT action.
 * @param route route for action
 * @return {(target:any, methodName:string, descriptor:PropertyDescriptor)=>PropertyDescriptor}
 */
export function HttpPut(route?: RouteType) {
    return function (target: any, methodName: string, descriptor: PropertyDescriptor) {
        return defineMethod(route || "", "put", target, methodName, descriptor);
    }
}

/**
 * Decorator for DELETE action.
 * @param route route for action
 * @return {(target:any, methodName:string, descriptor:PropertyDescriptor)=>PropertyDescriptor}
 */
export function HttpDelete(route?: RouteType) {
    return function (target: any, methodName: string, descriptor: PropertyDescriptor) {
        return defineMethod(route || "", "delete", target, methodName, descriptor);
    }
}

/**
 * Decorator for action with custom HTTP method name.
 * @param method HTTP method name
 * @param route route for action
 * @return {(target:any, methodName:string, descriptor:PropertyDescriptor)=>PropertyDescriptor}
 */
export function HttpMethod(method: HttpMethodName, route?: RouteType) {
    return function (target: any, methodName: string, descriptor: PropertyDescriptor) {
        return defineMethod(route || "", method, target, methodName, descriptor);
    }
}