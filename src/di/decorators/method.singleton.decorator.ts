import {Constants} from "../internal/constants";
import {decorateScope} from "./scope.decorator";

/**
 * Decorator that modifies provider so it will create only a single instance of dependency.
 */
export function Singleton() {

    return function (target: Function, methodName?: string) {
        decorateScope(Constants.SINGLETON_SCOPE, target, methodName);
    };
}