//import * as util from "util";
//import {HttpMethodMetadata} from "../core/decorators/http-method/http-method.metadata";
//import {DecoratorFactory} from "../core/decorators/factory/decorator.factory";
//import {HttpMethodWrapper} from "../core/decorators/http-method/http-method.wrapper";
//import {Parameter} from "../core/decorators/parameters/param.types";
//import {AuthRequiredMetadata} from "../core/decorators/http-method/http-auth-required.metadata";
//import {HttpResponseMetadata} from "../core/decorators/http-method/http-response.metadata";
//
///**
// * Service that helps to decorate methods.
// */
//export interface MethodDecoratorService<R, T, O> {
//
//    /**
//     * Define metadata for method.
//     * @param target target class
//     * @param methodName name of method
//     * @param descriptor property descriptor of method
//     * @param object metadata object
//     */
//    define(target: T, methodName: string, descriptor: PropertyDescriptor, object: O): R;
//
//    /**
//     * Get metadata from method.
//     * @param target target class
//     * @param methodName name of method
//     * @return {O|undefined} metadata object
//     */
//    get(target: T, methodName: string): O | undefined;
//}
//
//export class MethodDecoratorServiceImpl<R, T, O> extends MetadataService
//            implements MethodDecoratorService<R, T, O> {
//
//    public define(target: T, methodName: string, descriptor: PropertyDescriptor, object: O): R {
//        return undefined;
//    }
//
//    public get(target: T, methodName: string): any|O {
//        return undefined;
//    }
//
//}
//
///**
// * Implementation of service that throws an error if there are multiple same decorators used on single method.
// */
//export abstract class SingleMethodDecoratorService<R, T, O> extends MetadataService
//                implements MethodDecoratorService<R, T, O> {
//
//    public define(target: T, methodName: string, descriptor: PropertyDescriptor, object: O): R {
//        const metadataKey = this.getMetadataKey(methodName, object);
//        const metadata = Reflect.getMetadata(metadataKey, target, methodName) as O;
//        if (metadata) {
//            this.throwError(target, methodName, metadata);
//        }
//        return this.defineImpl(metadataKey, target, methodName, descriptor, object);
//    }
//
//    public get(target: T, methodName: string): any|O {
//        return Reflect.getMetadata(this.getMetadataKey(methodName, {} as O), target, methodName) as O;
//    }
//
//    /**
//     * Throw an error.
//     * @param target target class
//     * @param methodName name of method
//     * @param object metadata object
//     */
//    protected abstract throwError(target: T, methodName: string, object: O): never;
//
//    /**
//     * Continue metadata definition after error validation.
//     * @param metadataKey metadata key for method
//     * @param target target class
//     * @param methodName name of method
//     * @param descriptor property descriptor of method
//     * @param object metadata object
//     */
//    protected abstract defineImpl(metadataKey: string, target: Object, methodName: string,
//                                  descriptor: PropertyDescriptor, object: O): R;
//
//    /**
//     * Construct metadata key.
//     * @param methodName name of method
//     * @param object metadata object
//     */
//    protected abstract getMetadataKey(methodName: string, object: O): any;
//}
//
///**
// * Implementation of response type decorator service.
// */
//export class ResponseTypeDecoratorService extends SingleMethodDecoratorService<void, Object, HttpResponseMetadata> {
//
//    protected getMetadataKey(methodName: string, object: HttpResponseMetadata): any {
//        return this.metadataKey;
//    }
//
//    protected throwError(target: Function, methodName: string, object: HttpResponseMetadata): never {
//        throw new Error(`Multiple response types are not allowed: ${target.constructor.name}.${methodName}.`);
//    }
//
//    protected defineImpl(metadataKey: string, target: Object, methodName: string,
//                         descriptor: PropertyDescriptor, object: HttpResponseMetadata): void {
//        Reflect.defineMetadata(this.metadataKey, object, target, methodName);
//    }
//
//}
//
///**
// * Implementation of authorization required decorator service.
// */
//export class AuthRequiredDecoratorService extends SingleMethodDecoratorService<void, Object, AuthRequiredMetadata> {
//
//    protected getMetadataKey(methodName: string, object: AuthRequiredMetadata): any {
//        return this.metadataKey;
//    }
//
//    protected throwError(metadata: AuthRequiredMetadata): never {
//        throw new Error(`${metadata.targetName}.${metadata.propertyName}: \
//multiple @AuthorizationRequired decorators are not allowed.`);
//    }
//
//    protected defineImpl(metadataKey: string, target: Object, methodName: string,
//                         descriptor: PropertyDescriptor, object: AuthRequiredMetadata): void {
//        Reflect.defineMetadata(this.metadataKey, object, target, methodName);
//    }
//
//}
//
///**
// * Implementation of http method decorator service.
// */
//export class HttpMethodDecoratorService extends SingleMethodDecoratorService<void, Object, HttpMethodMetadata> {
//
//    protected getMetadataKey(methodName: string, object: HttpMethodMetadata): any {
//        return util.format(this.metadataKey, methodName, object.httpMethodName);
//    }
//
//    protected throwError(metadata: HttpMethodMetadata): never {
//        throw new Error(`${metadata.targetName}.${metadata.propertyName}: \
//multiple HTTP methods of the same type are not allowed: ${metadata.httpMethodName.toUpperCase()}`);
//    }
//
//    protected defineImpl(metadataKey: string, target: Object, methodName: string,
//                         descriptor: PropertyDescriptor, object: HttpMethodMetadata): void {
//        const paramService = DecoratorFactory.newRequiredParameterDecoratorService();
//        const injectParams = Reflect.getMetadataKeys(target, methodName)
//            .filter(metadataKey => metadataKey.startsWith(KEY_PARAM))
//            .map(metadataKey => Reflect.getMetadata(metadataKey, target, methodName) as ParamMetadata)
//            .map(metadata => {
//                const required = paramService.get(target, methodName, metadata.paramIndex);
//                return metadata.newBuilder()
//                    .setRequired(!!required && required.required)
//                    .build();
//            })
//            .sort((a, b) => a.paramIndex - b.paramIndex);
//        const origMethod = descriptor.value as Function;
//        const action = HttpMethodWrapper.newInstance(target, origMethod, object, injectParams);
//        const returnType = Reflect.getMetadata("design:returntype", target, methodName);
//        const httpMetadata = object.newBuilder()
//            .setAction(action)
//            .setReturnType(returnType)
//            .build();
//        HttpMethodDecoratorService.validatePathParams(injectParams, httpMetadata);
//        Reflect.defineMetadata(metadataKey, httpMetadata, target, methodName);
//    }
//
//    private static validatePathParams(injectParams: ParamMetadata[], httpMetadata: HttpMethodMetadata) {
//        injectParams
//            .filter(metadata => metadata.injectType === Parameter.PATH)
//            .forEach(metadata => {
//                const regexp = new RegExp(`:\\b${metadata.paramName}\\b`);
//                if (httpMetadata.route.toString().search(regexp) === -1) {
//                    throw new Error(`${httpMetadata.targetName}.${httpMetadata.propertyName}: \
//route "${httpMetadata.route}" doesn't contain path parameter "${metadata.paramName}"`);
//                }
//            });
//        if (["put", "post"].indexOf(httpMetadata.httpMethodName) === -1) {
//            const hasBody = injectParams
//                    .filter(metadata => metadata.injectType === Parameter.BODY)
//                    .length > 0;
//            if (hasBody) {
//                throw new Error(`${httpMetadata.targetName}.${httpMetadata.propertyName}: \
//action "${httpMetadata.httpMethodName}" can't inject "body". Maybe you want to use "post" or "put" instead?`);
//            }
//        }
//    }
//}