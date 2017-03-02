import {DecoratorFactory} from "../factory/decorator.factory";
import {ParameterMetadataBuilder} from "../../../../decorators/src/parameter.metadata";
import {ParamRequiredMetadata} from "./param-required.metadata";

/**
 * Decorator that tells server to check that injectable parameter exists (i.e. not null and not undefined).
 * @return {(target:Object, methodName:string, index:number)=>void}
 */
export function Required() {
    return function (target: Object, methodName: string, index: number) {
        const metadata = new ParameterMetadataBuilder()
            .setTargetName(target.constructor.name)
            .setPropertyName(methodName)
            .setParamIndex(index)
            .addParam(ParamRequiredMetadata.REQUIRED, true)
            .setParamNameRequired(false)
            .setParamTypeRequired(false)
            .build();
        DecoratorFactory.newRequiredParameterDecoratorService().define(target, methodName, index, metadata);
    };
}