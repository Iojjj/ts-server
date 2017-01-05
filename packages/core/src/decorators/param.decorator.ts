import {ParamMetadataImpl} from "./param.metadata";
import {ParamType} from "../server.types";
import {REQUIRED_PARAM_NAMES} from "../server.constants";
import {DecoratorFactory} from "./decorator.factory";

function defineParameter(injectType: ParamType, paramName?: string) {

    if (REQUIRED_PARAM_NAMES.indexOf(injectType) > -1 && !paramName) {
        throw new Error(`Injectable "${injectType}" requires "paramName" to be passed.`);
    }

    return function (target: Object, methodName: string, index: number) {
        const paramType = Reflect.getMetadata("design:paramtypes", target, methodName)[index];
        const metadata = new ParamMetadataImpl();
        metadata.injectType = injectType;
        metadata.paramIndex = index;
        metadata.paramType = paramType;
        metadata.paramName = paramName || "";
        DecoratorFactory.newParameterDecoratorService().define(target, methodName, index, metadata);
    }
}

/**
 * Decorator for request parameter.
 * @return {(target:Object, methodName:string, index:number)=>void}
 */
export function Req() {
    return defineParameter("req");
}

/**
 * Decorator for response parameter.
 * @return {(target:Object, methodName:string, index:number)=>void}
 */
export function Res() {
    return defineParameter("res");
}

/**
 * Decorator for next function parameter.
 * @return {(target:Object, methodName:string, index:number)=>void}
 */
export function Next() {
    return defineParameter("next");
}

/**
 * Decorator for request's body parameter.
 * @param paramName name of parameter. This could be useful if you need to get nested objects in JSON object.
 * Just pass something like <code>data.user.name</code> to retrieve a name property in this JSON object:
 * <pre>
 * {<br/>
 *      "data": {<br/>
 *          "user": {<br/>
 *              "name": "Some Name"<br/>
 *           }<br/>
 *      }<br/>
 * }<br/>
 * </pre>
 * @return {(target:Object, methodName:string, index:number)=>void}
 */
export function Body(paramName?: string) {
    return defineParameter("body", paramName);
}

/**
 * Decorator for request's query parameter.
 * @param paramName name of query parameter
 * @return {(target:Object, methodName:string, index:number)=>void}
 */
export function Query(paramName: string) {
    return defineParameter("query", paramName);
}

/**
 * Decorator for request's path parameter.
 * @param paramName name of path parameter
 * @return {(target:Object, methodName:string, index:number)=>void}
 */
export function Path(paramName: string) {
    return defineParameter("param", paramName);
}

/**
 * Decorator for request's header parameter.
 * @param paramName name of header parameter
 * @return {(target:Object, methodName:string, index:number)=>void}
 */
export function Header(paramName: string) {
    return defineParameter("header", paramName);
}

/**
 * Decorator for request's headers.
 * @return {(target:Object, methodName:string, index:number)=>void}
 */
export function Headers() {
    return defineParameter("headers");
}

/**
 * Decorator for request's file parameter.
 * @param paramName name of file parameter
 * @return {(target:Object, methodName:string, index:number)=>void}
 */
export function File(paramName: string) {
    return defineParameter("file", paramName);
}

/**
 * Decorator for request's files.
 * @return {(target:Object, methodName:string, index:number)=>void}
 */
export function Files() {
    return defineParameter("files");
}

/**
 * Decorator for request's session parameter.
 * @param paramName name of session parameter. Pass nothing to retrieve a whole session object.
 * @return {(target:Object, methodName:string, index:number)=>void}
 */
export function Session(paramName?: string) {
    return defineParameter("session", paramName);
}

/**
 * Decorator for request's cookie parameter.
 * @param paramName name of cookie parameter. Pass nothing to retrieve a whole cookies object.
 * @return {(target:Object, methodName:string, index:number)=>void}
 */
export function Cookie(paramName?: string) {
    return defineParameter("cookie", paramName);
}