import {decorateScope} from "../../../src/di/decorators/scope.decorator";

export function AmericanoScope() {
    return function (target: Function, methodName?: string) {
        decorateScope(Symbol.for("americano"), target, methodName);
    };
}