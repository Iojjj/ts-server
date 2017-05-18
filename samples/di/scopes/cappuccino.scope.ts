import {decorateScope} from "../../../src/public/di/decorators/scope.decorator";

export function CappuccinoScope() {
    return function (target: Function, methodName?: string) {
        decorateScope(Symbol.for("cappuccino"), target, methodName);
    };
}