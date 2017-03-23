/**
 * Representation of typed class.
 */
export interface Type<T> extends Function {
    new (...args: any[]): T;
}