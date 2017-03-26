import {decorateScope} from "../../../src/di/decorators/scope.decorator";

export function HeaterScope() {
    return function (target: Function, methodName?: string) {
        decorateScope(Symbol.for("heater"), target, methodName);
    };
}