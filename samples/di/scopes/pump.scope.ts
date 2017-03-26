import {decorateScope} from "../../../src/di/decorators/scope.decorator";

export function PumpScope() {
    return function (target: Function, methodName?: string) {
        decorateScope(Symbol.for("pump"), target, methodName);
    };
}