import "reflect-metadata";
import {isArray} from "util";
import {CreatableType} from "../../../../public/decorator-utils/types/creatable.type";
import {RouteUtilsImpl} from "../../core/utils/route.utils.impl";
import {SimpleMiddleware} from "../../../../public/server/core/models/base/abs.middleware";
import {ControllerOptions} from "../../../../public/server/core/models/options/controller-options";
import {MethodOptions} from "../../../../public/server/core/models/options/method-options";
import {MethodType} from "../../../../public/server/core/models/types/method-type";
import {ResponseType} from "../../../../public/server/core/models/types/response-type";
import {Route} from "../../../../public/server/core/models/types/route.type";
import {ControllerMetadata} from "../metadata/controller-metadata.bean";
import {ControllerMetadataBuilder} from "../metadata/controller-metadata.builder";
import {MethodMetadata} from "../metadata/method-metadata.bean";
import {MethodMetadataBuilder} from "../metadata/method-metadata.builder";
import {MiddlewareMetadata} from "../metadata/middleware-metadata.bean";
import {MiddlewareMetadataBuilder} from "../metadata/middleware-metadata.builder";
import {ParameterData} from "../metadata/parameters-metadata.bean";
import {ParameterDataBuilder} from "../metadata/parameters-metadata.builder";
import {ResponseHandlerMetadata} from "../metadata/response-handler-metadata.bean";
import {ResponseHandlerMetadataBuilder} from "../metadata/response-handler-metadata.builder";
import {RouteConfigurationBuilder} from "../metadata/route-configuration.builder";
import {DecoratorUtils as DI_DecoratorUtils} from "../../../../public/di/utils/decorator.utils";

/**
 * @internal
 */
export class DecoratorUtils {

    private static readonly METADATA_METHOD = "__method__";
    private static readonly METADATA_CONTROLLER = "__controller__";
    private static readonly METADATA_ERROR_HANDLER_MIDDLEWARE = "__error-handler__";
    private static readonly METADATA_AUTHORIZATION_HANDLER_MIDDLEWARE = "__authorization-handler__";
    private static readonly METADATA_ACCEPTS_TYPES_MIDDLEWARE = "__accepts-types-handler__";
    private static readonly METADATA_ACCEPTS_LANGUAGES_MIDDLEWARE = "__accepts-languages-handler__";
    private static readonly METADATA_MIDDLEWARE = "__middleware__";
    private static readonly METADATA_RESPONSE_HANDLER_MIDDLEWARE = "__response-handler__";
    private static readonly MIDDLEWARE_METHOD_NAME = "run";

    /**
     * Decorate HTTP method.
     * @param target class object
     * @param methodName name of method
     * @param type HTTP method type
     * @param options method options or route
     */
    public static decorateMethod(target: Object, methodName: string, type: MethodType,
                                 options?: MethodOptions | Route): void {
        const builder = new RouteConfigurationBuilder()
            .setRoute("")
            .setType(type);
        if (options) {
            const routeUtils = new RouteUtilsImpl();
            if (routeUtils.isRoute(options)) {
                builder.setRoute(options);
            } else {
                if (options.route !== undefined) {
                    builder.setRoute(options.route || "");
                }
                if (!!options.responseType) {
                    builder.setResponseType(options.responseType);
                }
            }
        }
        const opts = builder.build();
        const updateMetadata = (metadata: MethodMetadata) => {
            return metadata.newBuilder()
                .addRouteConfiguration(opts)
                .build();
        };
        this.updateMethodMetadata(target, methodName, updateMetadata);
    }

    /**
     * Update method metadata.
     * @param target class object
     * @param methodName name of method
     * @param updateMetadata method that will update metadata
     */
    public static updateMethodMetadata(target: Object, methodName: string,
                                       updateMetadata: (metadata: MethodMetadata) => MethodMetadata): void {
        this.checkIfMethodIsStatic(target, methodName);
        let metadata = this.getMethodMetadata(target, methodName);
        metadata = updateMetadata(metadata);
        metadata = this.updateArgumentsCount(target, methodName, metadata);
        Reflect.defineMetadata(DecoratorUtils.METADATA_METHOD, metadata, target, methodName);
    }

    /**
     * Check if method marked as static and throw an error.
     * @param target class object
     * @param methodName name of method
     */
    private static checkIfMethodIsStatic(target: Object, methodName: string): void {
        if (typeof target === "function") {
            const f = target as Function;
            throw new Error(`${f.name}.${methodName}: you can't apply HTTP method decorator on static method.`);
        }
    }

    /**
     * Decorate parameter of HTTP method.
     * @param target class object
     * @param methodName name of method
     * @param index index of parameter
     * @param constructorErrorMessage error message that will be displayed if user tries to decorate constructor
     * parameters
     * @param updateParam method that will update metadata
     */
    public static decorateParameter(target: Object, methodName: string, index: number,
                                    constructorErrorMessage: string,
                                    updateParam: (param: ParameterData) => ParameterData): void {
        if (typeof target === "function" && methodName === undefined) {
            const f = target as Function;
            throw new Error(`${f.name}: ${constructorErrorMessage}.`);
        }
        let metadata = Reflect.getMetadata(DecoratorUtils.METADATA_METHOD, target, methodName) as MethodMetadata;
        if (!metadata) {
            metadata = new MethodMetadataBuilder()
                .setTargetName(target.constructor.name)
                .setMethodName(methodName)
                .build();
        }
        let param = metadata.parameters.find(m => m.index === index) as ParameterData;
        if (!param) {
            const types = Reflect.getMetadata("design:paramtypes", target, methodName) as CreatableType[];
            param = new ParameterDataBuilder()
                .setIndex(index)
                .setType(types[index])
                .build();
        } else {
            metadata = metadata.newBuilder()
                .removeParameter(param)
                .build();
        }
        param = updateParam(param);
        metadata = metadata.newBuilder()
            .addParameter(param)
            .build();
        metadata = this.updateArgumentsCount(target, methodName, metadata);
        Reflect.defineMetadata(DecoratorUtils.METADATA_METHOD, metadata, target, methodName);
    }

    /**
     * Decorate middleware class.
     * @param target class of middleware
     * @param metadataKey metadata key that will be used for storing metadata
     */
    public static decorateMiddleware(target: Function) {
        DecoratorUtils.decorateMiddlewareInt(target, DecoratorUtils.METADATA_MIDDLEWARE,
            () => new MiddlewareMetadataBuilder(), DecoratorUtils.MIDDLEWARE_METHOD_NAME);
    }

    public static decorateErrorHandlerMiddleware(target: Function) {
        DecoratorUtils.decorateMiddlewareInt(target, DecoratorUtils.METADATA_ERROR_HANDLER_MIDDLEWARE,
            () => new MiddlewareMetadataBuilder(), DecoratorUtils.MIDDLEWARE_METHOD_NAME);
    }

    public static decorateAuthorizationHandlerMiddleware(target: Function) {
        DecoratorUtils.decorateMiddlewareInt(target, DecoratorUtils.METADATA_AUTHORIZATION_HANDLER_MIDDLEWARE,
            () => new MiddlewareMetadataBuilder(), DecoratorUtils.MIDDLEWARE_METHOD_NAME);
    }

    public static decorateAcceptsLanguagesMiddleware(target: Function) {
        DecoratorUtils.decorateMiddlewareInt(target, DecoratorUtils.METADATA_ACCEPTS_LANGUAGES_MIDDLEWARE,
            () => new MiddlewareMetadataBuilder(), DecoratorUtils.MIDDLEWARE_METHOD_NAME);
    }

    public static decorateAcceptsTypesMiddleware(target: Function) {
        DecoratorUtils.decorateMiddlewareInt(target, DecoratorUtils.METADATA_ACCEPTS_TYPES_MIDDLEWARE,
            () => new MiddlewareMetadataBuilder(), DecoratorUtils.MIDDLEWARE_METHOD_NAME);
    }

    /**
     * Decorate response handler middleware class.
     * @param target class of middleware
     * @param responseType response type handled by middleware
     */
    public static decorateResponseHandlerMiddleware(target: Function, responseType: ResponseType) {
        DecoratorUtils.decorateMiddlewareInt(target, DecoratorUtils.METADATA_RESPONSE_HANDLER_MIDDLEWARE,
            () => new ResponseHandlerMetadataBuilder(),
            DecoratorUtils.MIDDLEWARE_METHOD_NAME,
            (metadata: ResponseHandlerMetadata) => metadata.newBuilder()
                .setResponseType(responseType)
                .build());
    }

    public static isMiddleware(instance: Object): boolean {
        return DecoratorUtils.isMiddlewareInternal(instance, DecoratorUtils.METADATA_MIDDLEWARE);
    }

    public static isErrorHandlerMiddleware(instance: Object): boolean {
        return DecoratorUtils.isMiddlewareInternal(instance, DecoratorUtils.METADATA_ERROR_HANDLER_MIDDLEWARE);
    }

    public static isAuthorizationHandlerMiddleware(instance: Object): boolean {
        return DecoratorUtils.isMiddlewareInternal(instance, DecoratorUtils.METADATA_AUTHORIZATION_HANDLER_MIDDLEWARE);
    }

    public static isResponseHandlerMiddleware(instance: Object): boolean {
        return DecoratorUtils.isMiddlewareInternal(instance, DecoratorUtils.METADATA_RESPONSE_HANDLER_MIDDLEWARE);
    }

    public static isAcceptsTypesMiddleware(instance: Object): boolean {
        return DecoratorUtils.isMiddlewareInternal(instance, DecoratorUtils.METADATA_ACCEPTS_TYPES_MIDDLEWARE);
    }

    public static isAcceptsLanguagesMiddleware(instance: Object): boolean {
        return DecoratorUtils.isMiddlewareInternal(instance, DecoratorUtils.METADATA_ACCEPTS_LANGUAGES_MIDDLEWARE);
    }

    /**
     * Check if class of provided instance marked as an authorization handler middleware.
     * @param instance instance of middleware
     * @param metadataKey metadata key used for decoration of middleware
     * @return {boolean} true if class marked as an authorization handler middleware, false otherwise
     */
    private static isMiddlewareInternal(instance: Object, metadataKey: string): boolean {
        const proto = instance.constructor;
        const metadata = Reflect.getMetadata(metadataKey, proto) as MiddlewareMetadata | undefined;
        return !!metadata;
    }

    /**
     * Decorate a controller.
     * @param target class of controller
     * @param responseType default response type for all methods of controller
     * @param options controller options
     */
    public static decorateController(target: Function, responseType: ResponseType, options?: ControllerOptions): void {
        let version: string;
        let route: Route;
        if (options) {
            version = options.version || "";
            route = options.route || "";
        } else {
            version = "";
            route = "";
        }

        // get methods metadata including inherited
        let original = target;
        let methodsMetadata: MethodMetadata[][] = [];
        do {
            let prototype = original.prototype;
            if (!!prototype) {
                const array = Object
                    .keys(prototype)
                    .map(key => Reflect.getMetadata(DecoratorUtils.METADATA_METHOD, prototype, key) as MethodMetadata)
                    .filter(m => !!m);
                methodsMetadata.push(array);
            }
            original = Object.getPrototypeOf(original);
        } while (!!original);
        let type = "";
        if (responseType === ResponseType.JSON) {
            type = "application/json";
        } else if (responseType === ResponseType.ANY) {
            type = "*/*";
        }
        const map: Map<string, MethodMetadata> = new Map();
        methodsMetadata.forEach(array => array.forEach(m => {
            m = DecoratorUtils.updateRouteConfiguration(m, responseType);
            if (!!type && m.acceptsTypes.length === 0) {
                m = m.newBuilder()
                    .setAcceptsTypes([type])
                    .build();
            }
            return map.set(m.methodName, m);
        }));
        const metadata = new ControllerMetadataBuilder()
            .setTargetName(target.name)
            .setVersion(version)
            .setResponseType(responseType)
            .setRoute(route)
            .setMethodMetadata(map)
            .build();
        Reflect.defineMetadata(DecoratorUtils.METADATA_CONTROLLER, metadata, target);
    }

    private static updateRouteConfiguration(m: MethodMetadata, responseType: ResponseType): MethodMetadata {
        // set response type to routes
        const routes = m.routes;
        const builder = m.newBuilder()
            .clearRouteConfigurations();
        routes.forEach(r => {
            const newRoute = r.newBuilder()
                .setResponseType(r.responseType ? r.responseType : responseType)
                .build();
            builder.addRouteConfiguration(newRoute);
        });
        return builder.build();
    }

    /**
     * Get controller's metadata.
     * @param controller instance of controller
     * @return {ControllerMetadata} instance of controller metadata
     */
    public static getControllerMetadata(controller: Object): ControllerMetadata {
        const proto = controller.constructor;
        const metadata = Reflect
            .getMetadata(DecoratorUtils.METADATA_CONTROLLER, proto) as ControllerMetadata | undefined;
        if (!metadata) {
            throw new Error(`Controller "${proto.name}" is not decorated with @Controller decorator.`);
        }
        return metadata;
    }

    /**
     * Get method's metadata.
     * @param target class object
     * @param methodName name of method
     * @return {MethodMetadata} instance of metadata
     */
    private static getMethodMetadata(target: Object, methodName: string): MethodMetadata {
        let metadata = Reflect.getMetadata(DecoratorUtils.METADATA_METHOD, target, methodName) as MethodMetadata;
        if (!metadata) {
            metadata = new MethodMetadataBuilder()
                .setTargetName(target.constructor.name)
                .setMethodName(methodName)
                .build();
        }
        return metadata;
    }

    public static getMiddlewareMetadata(instance: Object): MiddlewareMetadata {
        return DecoratorUtils.getMiddlewareMetadataInternal(instance, DecoratorUtils.METADATA_MIDDLEWARE);
    }

    public static getAuthorizationMetadata(instance: Object): MiddlewareMetadata {
        return DecoratorUtils.getMiddlewareMetadataInternal(instance,
            DecoratorUtils.METADATA_AUTHORIZATION_HANDLER_MIDDLEWARE);
    }

    public static getErrorHandlerMetadata(instance: Object): MiddlewareMetadata {
        return DecoratorUtils.getMiddlewareMetadataInternal(instance,
            DecoratorUtils.METADATA_ERROR_HANDLER_MIDDLEWARE);
    }

    public static getResponseHandlerMetadata(instance: Object): MiddlewareMetadata {
        return DecoratorUtils.getMiddlewareMetadataInternal(instance,
            DecoratorUtils.METADATA_RESPONSE_HANDLER_MIDDLEWARE);
    }

    /**
     * Get metadata of error handler middleware.
     * @param instance instance of error handler middleware
     * @param metadataKey metadata key used for decoration of middleware
     * @return {MiddlewareMetadata} instance of error handler metadata
     */
    private static getMiddlewareMetadataInternal(instance: Object, metadataKey: string): MiddlewareMetadata {
        const proto = instance.constructor;
        const metadata = Reflect
            .getMetadata(metadataKey, proto) as MiddlewareMetadata | undefined;
        if (!metadata) {
            throw new Error(`Middleware "${proto.name}" is not decorated with @Middleware decorator.`);
        }
        return metadata;
    }

    /**
     * Update count of method's arguments.
     * @param target class object
     * @param methodName name of method
     * @param metadata instance of method metadata
     * @return {MethodMetadata} updated instance of method metadata
     */
    private static updateArgumentsCount(target: Object, methodName: string, metadata: MethodMetadata): MethodMetadata {
        const paramTypes = Reflect.getMetadata("design:paramtypes", target, methodName);
        if (!!paramTypes && isArray(paramTypes)) {
            metadata = metadata.newBuilder()
                .setTotalArgsCount(paramTypes.length)
                .build();
        }
        return metadata;
    }

    /**
     * Check if provided class inherits middleware class.
     * @param target any class
     */
    public static checkIfMiddlewareAndThrow(target: Function): void {
        target = DI_DecoratorUtils.unwrapType(target);
        let isMiddleware = target.prototype instanceof SimpleMiddleware;
        if (!isMiddleware) {
            throw new Error(`${target.name} must inherit ${SimpleMiddleware.name} class.`);
        }
    }

    private static decorateMiddlewareInt(target: Function,
                                         metadataKey: string,
                                         builderCreator: () => MiddlewareMetadataBuilder,
                                         methodName: string,
                                         updateMetadata?: (metadata: MiddlewareMetadata) => MiddlewareMetadata): void {
        target = DI_DecoratorUtils.unwrapType(target);
        const proto = target.prototype;
        const methodMetadata = Object
            .keys(proto)
            .map(key => Reflect.getMetadata(DecoratorUtils.METADATA_METHOD, proto, key) as MethodMetadata)
            .filter(m => !!m);
        methodMetadata.forEach(m => {
            if (m.methodName !== methodName) {
                throw new Error(`${m.targetName}.${m.methodName}: can't inject parameters. You must inject only ` +
                    `to "${methodName}" method.`);
            }
        });
        if (methodMetadata.length > 1) {
            const m = methodMetadata[0];
            throw new Error(`${m.targetName}.${m.methodName}: multiple instance of methods detected.`);
        }
        let metadata: MiddlewareMetadata;
        const builder = builderCreator();
        if (methodMetadata.length === 0) {
            metadata = builder
                .setTargetName(target.name)
                .setMethodName(DecoratorUtils.MIDDLEWARE_METHOD_NAME)
                .setTotalArgsCount(0)
                .build();
        } else {
            const m = methodMetadata[0];
            builder
                .setTargetName(m.targetName)
                .setMethodName(m.methodName)
                .setTotalArgsCount(m.totalArgsCount);
            m.parameters.forEach(p => builder.addParameter(p));
            metadata = builder.build();
        }
        if (updateMetadata) {
            metadata = updateMetadata(metadata);
        }
        Reflect.defineMetadata(metadataKey, metadata, target);
    }

    //noinspection JSUnusedLocalSymbols
    private constructor() {

    }
}