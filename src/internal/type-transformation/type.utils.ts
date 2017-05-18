/**
 * @internal
 */
export class TypeUtils {

    public static checkAndThrowIf(target: Object, propertyName: string, ...types: Function[]): void {
        const returnType = Reflect.getMetadata("design:type", target, propertyName);
        types.forEach(type => {
            if (returnType === type) {
                throw new Error(`${target.constructor.name}.${propertyName}: can't transform to type ${type.name}. `
                    + `Try to use different decorator.`);
            }
        });
    }

    public static checkAndThrowIfNot(target: Object, propertyName: string, ...types: Function[]): void {
        const returnType = Reflect.getMetadata("design:type", target, propertyName);
        const passed = types.map(type => returnType === type)
            .reduce((a, s) => a || s, false);
        if (!passed) {
            throw new Error(`${target.constructor.name}.${propertyName}: can't transform to type ${returnType.name}. `
                + `Try to use different decorator.`);
        }
    }

    public static checkAndThrowIfGeneric(target: Object, propertyName: string): void {
        const returnType = Reflect.getMetadata("design:type", target, propertyName);
        if (!returnType || returnType === Object || returnType === Function) {
            throw new Error(`${target.constructor.name}.${propertyName}: can't transform to type `
                + `${returnType ? returnType.name : "void or any"}.`);
        }
    }

    //noinspection JSUnusedLocalSymbols
    private constructor() {

    }
}