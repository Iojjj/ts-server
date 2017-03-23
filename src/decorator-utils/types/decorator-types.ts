/**
 * Decorator for static methods.
 */
export type StaticMethodDecorator = (target: Function, methodName: string, descriptor: PropertyDescriptor) => any;