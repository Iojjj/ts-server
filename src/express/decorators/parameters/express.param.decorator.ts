import {defineParameter, PreValidationFunction} from "../../../../core/decorators/parameters/param.decorator";
import {ExpressParameters} from "../../express.param.types";

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
 * @param nullValue value that would be returned if parameter is null.
 *                  Must be of same type as parameter, null or undefined.
 * @param undefinedValue value that would be returned if parameter is undefined.
 *                       Must be of same type as parameter, null or undefined.
 * @return {(target:Object, methodName:string, index:number)=>void}
 */
export function Body(paramName?: string, nullValue?: any, undefinedValue?: any) {
    return defineParameter(ExpressParameters.BODY, paramName, nullValue, undefinedValue);
}

/**
 * Decorator for request's query parameter.
 * @param paramName name of query parameter.
 * @param nullValue value that would be returned if parameter is null.
 *                  Must be of same type as parameter, null or undefined.
 * @param undefinedValue value that would be returned if parameter is undefined.
 *                       Must be of same type as parameter, null or undefined.
 * @return {(target:Object, methodName:string, index:number)=>void}
 */
export function Query(paramName: string, nullValue?: any, undefinedValue?: any) {
    return defineParameter(ExpressParameters.QUERY, paramName,
        nullValue, undefinedValue, checkParameterName(paramName));
}

/**
 * Decorator for request's path parameter.
 * @param paramName name of path parameter
 * @param nullValue value that would be returned if parameter is null.
 *                  Must be of same type as parameter, null or undefined.
 * @param undefinedValue value that would be returned if parameter is undefined.
 *                       Must be of same type as parameter, null or undefined.
 * @return {(target:Object, methodName:string, index:number)=>void}
 */
export function Path(paramName: string, nullValue?: any, undefinedValue?: any) {
    return defineParameter(ExpressParameters.PATH, paramName,
        nullValue, undefinedValue, checkParameterName(paramName));
}

/**
 * Decorator for request's header parameter.
 * @param paramName name of header parameter. Do not specify to retrieve whole headers object
 * @param nullValue value that would be returned if parameter is null.
 *                  Must be of same type as parameter, null or undefined.
 * @param undefinedValue value that would be returned if parameter is undefined.
 *                       Must be of same type as parameter, null or undefined.
 * @return {(target:Object, methodName:string, index:number)=>void}
 */
export function Headers(paramName?: string, nullValue?: any, undefinedValue?: any) {
    return defineParameter(ExpressParameters.HEADERS, paramName, nullValue, undefinedValue);
}

function checkParameterName(paramName?: string): PreValidationFunction {
    return (target: Object, methodName: string, index: number) => {
        if (!paramName) {
            throw new Error(`${target.constructor.name}.${methodName}: \
you must specify "paramName" for argument at index ${index}.`);
        }
    };
}