/**
 * Representation of types with static constructor, for example, {@link Symbol}.
 */
export interface StaticType<T> extends Function {
    (...args: any[]): T;
}