import {ParamType, REQUIRED_PARAM_NAMES} from "./param.type";
import {ParamMetadata} from "./param.metadata";
import {Decorator} from "./decorator";

function defineParameter(injectType: ParamType, paramName?: string) {

    if (REQUIRED_PARAM_NAMES.indexOf(injectType) > -1 && !paramName) {
        throw new Error(`Injectable "${injectType}" requires "paramName" to be passed.`);
    }

    return function (target: Object, methodName: string, index: number) {
        const paramType = Reflect.getMetadata("design:paramtypes", target, methodName)[index];
        const metadata = <ParamMetadata> {
            injectType: injectType,
            paramIndex: index,
            paramType: paramType,
            paramName: paramName || ""
        };
        Decorator.defineParameter(target, methodName, metadata);
    }
}

export function Req() {
    return defineParameter("req");
}

export function Res() {
    return defineParameter("res");
}

export function Next() {
    return defineParameter("next");
}

export function Body(paramName?: string) {
    return defineParameter("body", paramName);
}

export function Query(paramName: string) {
    return defineParameter("query", paramName);
}

export function Path(paramName: string) {
    return defineParameter("param", paramName);
}

export function Header(paramName: string) {
    return defineParameter("header", paramName);
}

export function Headers() {
    return defineParameter("headers");
}

export function File(paramName: string) {
    return defineParameter("file", paramName);
}

export function Files() {
    return defineParameter("files");
}

export function Session(paramName?: string) {
    return defineParameter("session", paramName);
}

export function Cookie(paramName: string) {
    return defineParameter("cookie", paramName);
}

export function Cookies() {
    return defineParameter("cookies");
}