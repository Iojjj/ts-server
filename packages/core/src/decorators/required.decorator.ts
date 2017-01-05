import {DecoratorFactory} from "./decorator.factory";

/**
 * Decorator that tells server to check that injectable parameter exists (i.e. not null and not undefined).
 * @return {(target:Object, methodName:string, index:number)=>void}
 */
export function Required() {
    return function (target: Object, methodName: string, index: number) {
        DecoratorFactory.newRequiredParameterDecoratorService().define(target, methodName, index, "required");
    }
}