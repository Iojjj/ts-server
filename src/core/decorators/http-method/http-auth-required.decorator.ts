import {DecoratorFactory} from "../factory/decorator.factory";
import {AuthRequiredMetadataBuilder} from "./http-auth-required.metadata";

/**
 * Decorator that tells server to check if user is authorized before executing controller's action.
 * @returns {(target:Object, methodName:string, descriptor:PropertyDescriptor)=>void}
 */
export function AuthorizationRequired() {
    return function (target: Object, methodName: string, descriptor: PropertyDescriptor) {
        const metadata = new AuthRequiredMetadataBuilder()
            .setTargetName(target.constructor.name)
            .setPropertyName(methodName)
            .setRequired(true)
            .build();
        DecoratorFactory.newAuthRequiredDecoratorService().define(target, methodName, descriptor, metadata);
    };
}