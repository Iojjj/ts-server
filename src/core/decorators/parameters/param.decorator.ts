import {DecoratorFactory} from "../factory/decorator.factory";
import {Parameter} from "./param.types";
import {ParameterMetadataBuilder} from "../../../../decorators/src/parameter.metadata";
import {ParamMetadata} from "./param.metadata";

export type PreValidationFunction = (target: Object, methodName: string, index: number) => void;

export function defineParameter(injectType: Parameter, paramName?: string,
                                nullValue?: any, undefinedValue?: any, preValidation?: PreValidationFunction) {

    return function (target: Object, methodName: string, index: number) {
        if (preValidation) {
            preValidation(target, methodName, index);
        }
        if (!injectType.container) {
            throw new Error(`${target.constructor.name}.${methodName}: you must specify container's name \
for argument at index ${index}.`);
        }
        const paramType = Reflect.getMetadata("design:paramtypes", target, methodName)[index];
        const metadata = new ParameterMetadataBuilder()
            .setTargetName(target.constructor.name)
            .setPropertyName(methodName)
            .setParamName(paramName || "")
            .setParamIndex(index)
            .setParamType(paramType)
            .addParam(ParamMetadata.INJECT_TYPE, injectType)
            .addParam(ParamMetadata.NULL_VALUE, nullValue)
            .addParam(ParamMetadata.UNDEFINED_VALUE, undefinedValue)
            .build();
        DecoratorFactory.newParameterDecoratorService().define(target, methodName, index, metadata);
    };
}

/**
 * Decorator for request parameter.
 * @return {(target:Object, methodName:string, index:number)=>void}
 */
export function Req() {
    return defineParameter(Parameter.REQUEST);
}

/**
 * Decorator for response parameter.
 * @return {(target:Object, methodName:string, index:number)=>void}
 */
export function Res() {
    return defineParameter(Parameter.RESPONSE);
}

/**
 * Decorator for custom parameter that stored in req object.
 * @param container name of container
 * @param paramName name of parameter. Do not specify to retrieve whole container object.
 * @param nullValue value that would be returned if parameter is null.
 *                  Must be of same type as parameter, null or undefined.
 * @param undefinedValue value that would be returned if parameter is undefined.
 *                       Must be of same type as parameter, null or undefined.
 * @return {(target:Object, methodName:string, index:number)=>void}
 */
export function Param(container: string, paramName?: string, nullValue?: any, undefinedValue?: any) {
    return defineParameter(Parameter.create(container), paramName, nullValue, undefinedValue);
}