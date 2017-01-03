import {Decorator} from "./decorator";
import {HttpMethodName} from "./http-method.names";

export type RouteType = string | RegExp;

function defineHttpMethod(methodName: HttpMethodName, route: RouteType) {
    return Decorator.defineHttpMethod(methodName, route);
}

export function HttpGet(): Function;
export function HttpGet(route: string): Function;
export function HttpGet(route: RegExp): Function;
export function HttpGet(route?: RouteType): Function {
    return defineHttpMethod("get", route || "");
}

export function HttpPost(): Function;
export function HttpPost(route: string): Function;
export function HttpPost(route: RegExp): Function;
export function HttpPost(route?: RouteType): Function {
    return defineHttpMethod("post", route || "");
}

export function HttpPut(): Function;
export function HttpPut(route: string): Function;
export function HttpPut(route: RegExp): Function;
export function HttpPut(route?: RouteType): Function {
    return defineHttpMethod("put", route || "");
}


export function HttpDelete(): Function;
export function HttpDelete(route: string): Function;
export function HttpDelete(route: RegExp): Function;
export function HttpDelete(route?: RouteType): Function {
    return defineHttpMethod("delete", route || "");
}

export function HttpMethod(method: HttpMethodName): Function;
export function HttpMethod(method: HttpMethodName, route: string): Function;
export function HttpMethod(method: HttpMethodName, route: RegExp): Function;
export function HttpMethod(method: HttpMethodName, route?: RouteType): Function {
    return defineHttpMethod(method, route || "");
}