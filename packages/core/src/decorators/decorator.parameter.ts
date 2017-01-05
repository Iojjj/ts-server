import {AbstractDecoratorService} from "./decorator.service";
import {ParamMetadata} from "./param.metadata";
import * as util from "util";

/**
 * Service that helps to decorate parameters.
 */
export interface ParameterDecoratorService<T, O> {

    /**
     * Define metadata for parameter.
     * @param target target class
     * @param methodName name of method
     * @param index index of parameter in method's signature
     * @param object metadata object
     */
    define(target: T, methodName: string, index: number, object: O): void;

    /**
     * Get metadata from parameter.
     * @param target target class
     * @param methodName name of method
     * @param index index of parameter in method's signature
     * @return {O|undefined} metadata object
     */
    get(target: T, methodName: string, index: number): O | undefined;
}

/**
 * Implementation of service that throws an error if there are multiple same decorators used on single parameter.
 */
abstract class SingleParameterDecoratorService<T, O> extends AbstractDecoratorService implements ParameterDecoratorService<T, O> {

    public define(target: T, methodName: string, index: number, object: O): void {
        const metadataKey = util.format(this.metadataKey, methodName, index);
        const metadata = Reflect.getMetadata(metadataKey, target, methodName) as ParamMetadata;
        if (metadata) {
            this.throwError(target, methodName, metadata);
        }
        Reflect.defineMetadata(metadataKey, object, target, methodName);
    }

    public get(target: T, methodName: string, index: number): O | undefined {
        const metadataKey = util.format(this.metadataKey, methodName, index);
        return Reflect.getMetadata(metadataKey, target, methodName) as O;
    }

    /**
     * Throw an error.
     * @param target target method
     * @param methodName name of method
     * @param metadata metadata object
     */
    protected abstract throwError(target: T, methodName: string, metadata: ParamMetadata): never;
}

/**
 * Implementation of parameter injection decorator service.
 */
export class InjectableParameterDecoratorService extends SingleParameterDecoratorService<Object, ParamMetadata> {

    protected throwError(target: Object, methodName: string, metadata: ParamMetadata): never {
        throw new Error(`Multiple injections on same parameter are not allowed: \
${target.constructor.name}.${methodName} - (${metadata.paramType})${metadata.paramName} at index \
${metadata.paramIndex}`);
    }

}

/**
 * Implementation of required parameter decorator service.
 */
export class RequiredParameterDecoratorService extends SingleParameterDecoratorService<Object, string> {

    protected throwError(target: Object, methodName: string, metadata: ParamMetadata): never {
        throw new Error(`Multiple @Required are not allowed: ${target.constructor.name}.${methodName}. \
- (${metadata.paramType})${metadata.paramName} at index ${metadata.paramIndex}`);
    }
}