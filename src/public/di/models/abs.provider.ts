/**
 * Provider for injectable dependencies that represents a factory.
 */
export abstract class Provider<T> {

    public abstract get(): T;
}