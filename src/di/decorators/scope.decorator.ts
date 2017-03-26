import {DecoratorUtils} from "../utils/decorator.utils";
/**
 * Decorator that modifies provider so it will create only a single instance of dependency.
 */
export function decorateScope(scope: symbol, target: Function, methodName?: string) {
    if (!!methodName) {
        DecoratorUtils.updateProviderMetadata(target, methodName, metadata => metadata.newBuilder()
            .setScope(scope)
            .build());
    } else {
        DecoratorUtils.setScope(target, scope);
    }
}