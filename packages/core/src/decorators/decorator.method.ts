import {AbstractDecoratorService} from "./decorator.service";
import * as util from "util";
import {HttpMethodMetadata, HttpMethodMetadataImpl} from "./http-method.metadata";
import {ParamMetadataImpl, ParamMetadata} from "./param.metadata";
import {Driver} from "../server.driver";
import {ResponseType} from "../server.types";
import {DecoratorFactory} from "./decorator.factory";
import {KEY_PARAM} from "./decorator.constants";

/**
 * Service that helps to decorate methods.
 */
export interface MethodDecoratorService<R, T, O> {

    /**
     * Define metadata for method.
     * @param target target class
     * @param methodName name of method
     * @param descriptor property descriptor of method
     * @param object metadata object
     */
    define(target: T, methodName: string, descriptor: PropertyDescriptor, object: O): R;

    /**
     * Get metadata from method.
     * @param target target class
     * @param methodName name of method
     * @return {O|undefined} metadata object
     */
    get(target: T, methodName: string): O | undefined;
}

/**
 * Implementation of service that throws an error if there are multiple same decorators used on single method.
 */
abstract class SingleMethodDecoratorService<R, T, O> extends AbstractDecoratorService implements MethodDecoratorService<R, T, O> {

    public define(target: T, methodName: string, descriptor: PropertyDescriptor, object: O): R {
        const metadataKey = this.getMetadataKey(methodName, object);
        const metadata = Reflect.getMetadata(metadataKey, target, methodName) as O;
        if (metadata) {
            this.throwError(target, methodName, metadata);
        }
        return this.defineImpl(metadataKey, target, methodName, descriptor, object);
    }

    public get(target: T, methodName: string): any|O {
        return Reflect.getMetadata(this.getMetadataKey(methodName, {} as O), target, methodName) as O;
    }

    /**
     * Throw an error.
     * @param target target class
     * @param methodName name of method
     * @param object metadata object
     */
    protected abstract throwError(target: T, methodName: string, object: O): never;

    /**
     * Continue metadata definition after error validation.
     * @param metadataKey metadata key for method
     * @param target target class
     * @param methodName name of method
     * @param descriptor property descriptor of method
     * @param object metadata object
     */
    protected abstract defineImpl(metadataKey: string, target: Object, methodName: string,
                                  descriptor: PropertyDescriptor, object: O): R;

    /**
     * Construct metadata key.
     * @param methodName name of method
     * @param object metadata object
     */
    protected abstract getMetadataKey(methodName: string, object: O): any;
}

/**
 * Implementation of response type decorator service.
 */
export class ResponseTypeDecoratorService extends SingleMethodDecoratorService<void, Object, ResponseType> {

    protected getMetadataKey(methodName: string, object: ResponseType): any {
        return this.metadataKey
    }

    protected throwError(target: Object, methodName: string, object: ResponseType): never {
        throw new Error(`Multiple response types are not allowed: ${target.constructor.name}.${methodName}.`);
    }

    protected defineImpl(metadataKey: string, target: Object, methodName: string, descriptor: PropertyDescriptor, object: ResponseType): void {
        Reflect.defineMetadata(this.metadataKey, object, target, methodName);
    }

}

/**
 * Implementation of authorization required decorator service.
 */
export class AuthRequiredDecoratorService extends SingleMethodDecoratorService<void, Object, string> {

    protected getMetadataKey(methodName: string, object: string): any {
        return this.metadataKey;
    }

    protected throwError(target: Object, methodName: string, object: string): never {
        throw new Error(`Multiple @AuthorizationRequired decorators are not allowed: ${target.constructor.name}.${methodName}.`);
    }

    protected defineImpl(metadataKey: string, target: Object, methodName: string, descriptor: PropertyDescriptor, object: string): void {
        Reflect.defineMetadata(this.metadataKey, object, target, methodName);
    }

}

/**
 * Implementation of http method decorator service.
 */
export class HttpMethodDecoratorService extends SingleMethodDecoratorService<PropertyDescriptor, Object, HttpMethodMetadata> {

    protected getMetadataKey(methodName: string, object: HttpMethodMetadata): any {
        return util.format(this.metadataKey, methodName, object.httpMethodName);
    }

    protected throwError(target: Object, methodName: string, object: HttpMethodMetadata): never {
        throw new Error(`Multiple HTTP methods of the same type are not allowed: \
${object.httpMethodName.toUpperCase()} - ${target.constructor.name}.${methodName}`);
    }

    protected defineImpl(metadataKey: string, target: Object, methodName: string,
                         descriptor: PropertyDescriptor, object: HttpMethodMetadata): PropertyDescriptor {
        const paramService = DecoratorFactory.newRequiredParameterDecoratorService();
        const injectParams = Reflect.getMetadataKeys(target, methodName)
            .filter(metadataKey => metadataKey.startsWith(KEY_PARAM))
            .map(metadataKey => Reflect.getMetadata(metadataKey, target, methodName) as ParamMetadataImpl)
            .map(metadata => {
                const required = paramService.get(target, methodName, metadata.paramIndex);
                metadata.required = required === "required";
                return metadata;
            })
            .sort((a, b) => a.paramIndex - b.paramIndex);
        const origMethod = descriptor.value as Function;
        let httpMetadata = new HttpMethodMetadataImpl();
        const action = function (req: any, res: any, next: any, driver: Driver<any, any>) {
            if (httpMetadata.authorizationRequired/* && !driver.isAuthorized(req)*/) {
                next(new Error("Not Authorized"));
                return;
            }
            const args = HttpMethodDecoratorService.getArguments(req, res, next, injectParams, driver);
            return origMethod.apply(target, args);
        };
        httpMetadata.route = object.route;
        httpMetadata.action = action;
        httpMetadata.httpMethodName = object.httpMethodName;
        HttpMethodDecoratorService.validatePathParams(injectParams, httpMetadata);
        Reflect.defineMetadata(metadataKey, httpMetadata, target, methodName);
        descriptor.value = action;
        return descriptor;
    }

    private static validatePathParams(injectParams: ParamMetadata[], httpMetadata: HttpMethodMetadataImpl) {
        injectParams
            .filter(metadata => metadata.injectType === "param")
            .forEach(metadata => {
                const regexp = new RegExp(`:\\b${metadata.paramName}\\b`);
                if (httpMetadata.route.toString().search(regexp) === -1) {
                    throw new Error(`Route "${httpMetadata.route}" doesn't contain \
path parameter "${metadata.paramName}"`);
                }
            });
        if (["put", "post"].indexOf(httpMetadata.httpMethodName) === -1) {
            const hasBody = injectParams
                    .filter(metadata => metadata.injectType === "body")
                    .length > 0;
            if (hasBody) {
                throw new Error(`Action "${httpMetadata.httpMethodName}" can't inject "body". \
Maybe you want to use "post" or "put" instead?`);
            }
        }
    }

    private static getArguments<T, Rq>(req: any, res: any, next: any,
                                       injectParams: ParamMetadata[], driver: Driver<T, Rq>): any[] {
        return injectParams
            .map(metadata => HttpMethodDecoratorService.getArgument(req, res, next, metadata, driver))
            .reduce((all, single) => all.concat(single), []);
    }

    private static getArgument<T, Rq>(req: Rq, res: any, next: any,
                                      metadata: ParamMetadata, driver: Driver<T, Rq>): any {
        let arg: any;
        switch (metadata.injectType) {
            case "req": {
                arg = req;
                break;
            }
            case "res": {
                arg = res;
                break;
            }
            case "next": {
                arg = next;
                break;
            }
            default: {
                arg = driver.getArgument(req, metadata.injectType, metadata.paramName);
                break;
            }
        }
        if (metadata.required && (arg == null || arg === undefined)) {
            throw new Error(`Can't inject required parameter: \
(${metadata.paramType}) ${metadata.paramName} is ${arg}.`);
        }
        return arg;
    }

}