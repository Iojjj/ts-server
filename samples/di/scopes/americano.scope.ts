import {decorateScope} from "../../../src/public/di/decorators/scope.decorator";

export function AmericanoScope() {
    return function (target: Function, methodName?: string) {
        decorateScope(Symbol.for("americano"), target, methodName);
    };
}