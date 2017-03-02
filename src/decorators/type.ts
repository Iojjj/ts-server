/**
 * Representation of specific type.
 */
export interface Type<T> extends Function {
    new (...args: any[]): T;
}

/**
 * Representation of any type.
 */
export interface AnyType extends Type<any> {

}