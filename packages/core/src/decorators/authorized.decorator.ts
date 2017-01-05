import {DecoratorFactory} from "./decorator.factory";

/**
 * Decorator that tells server to check if user is authorized before executing controller's action.
 * @returns {(target:Object, methodName:string, descriptor:PropertyDescriptor)=>void}
 */
export function AuthorizationRequired() {
    return function (target: Object, methodName: string, descriptor: PropertyDescriptor) {
        DecoratorFactory.newAuthRequiredDecoratorService().define(target, methodName, descriptor, "required");
    }
}