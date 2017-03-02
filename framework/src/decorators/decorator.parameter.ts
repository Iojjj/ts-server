//import {MetadataService} from "./metadata.service";
//import {ParamMetadata} from "../core/decorators/parameters/param.metadata";
//import * as util from "util";
//import {ParamRequiredMetadata} from "../core/decorators/parameters/param-required.metadata";
//
///**
// * Service that helps to decorate parameters.
// */
//export interface ParameterDecoratorService<T, O> {
//
//    /**
//     * Define metadata for parameter.
//     * @param target target class
//     * @param methodName name of method
//     * @param index index of parameter in method's signature
//     * @param object metadata object
//     */
//    define(target: T, methodName: string, index: number, object: O): void;
//
//    /**
//     * Get metadata from parameter.
//     * @param target target class
//     * @param methodName name of method
//     * @param index index of parameter in method's signature
//     * @return {O|undefined} metadata object
//     */
//    get(target: T, methodName: string, index: number): O | undefined;
//}
//
///**
// * Implementation of service that throws an error if there are multiple same decorators used on single parameter.
// */
//export abstract class SingleParameterDecoratorService<T, O> extends MetadataService
//    implements ParameterDecoratorService<T, O> {
//
//    public define(target: T, methodName: string, index: number, object: O): void {
//        const metadataKey = util.format(this.metadataKey, methodName, index);
//        const metadata = Reflect.getMetadata(metadataKey, target, methodName) as O;
//        if (metadata) {
//            this.throwError(metadata);
//        }
//        Reflect.defineMetadata(metadataKey, object, target, methodName);
//    }
//
//    public get(target: T, methodName: string, index: number): O | undefined {
//        const metadataKey = util.format(this.metadataKey, methodName, index);
//        return Reflect.getMetadata(metadataKey, target, methodName) as O;
//    }
//
//    /**
//     * Throw an error.
//     * @param metadata metadata object
//     */
//    protected abstract throwError(metadata: O): never;
//}
//
///**
// * Implementation of parameter injection decorator service.
// */
//export class InjectableParameterDecoratorService extends SingleParameterDecoratorService<Object, ParamMetadata> {
//
//    protected throwError(metadata: ParamMetadata): never {
//        throw new Error(`${metadata.targetName}.${metadata.propertyName}: multiple injections on same parameter \
//are not allowed at index ${metadata.paramIndex}.`);
//    }
//
//}
//
///**
// * Implementation of required parameter decorator service.
// */
//export class RequiredParameterDecoratorService extends SingleParameterDecoratorService<Object, ParamRequiredMetadata> {
//
//    protected throwError(metadata: ParamRequiredMetadata): never {
//        throw new Error(`${metadata.targetName}.${metadata.propertyName}: multiple @Required decorators are \
//not allowed at index ${metadata.paramIndex}.`);
//    }
//}