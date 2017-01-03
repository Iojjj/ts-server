import {ServerDecoratorOptions} from "./server.decorator";
import {Server} from "../server";
import {Driver} from "../server.driver";
import * as glob from "glob";
import * as path from "path";
import * as util from "util";
import {ControllerDecoratorOptions} from "./controller.decorator";
import {ControllerMetadataBuilder, ControllerMetadata} from "./controller.metadata";
import {ParamMetadata} from "./param.metadata";
import {HttpMethodMetadata} from "./http-method.metadata";
import {RouteType} from "./http-method.decorators";
import {HttpMethodName} from "./http-method.names";
import "reflect-metadata";

export class Decorator {

    private static readonly KEY_FORMAT = "__metadata_%s__";
    private static readonly KEY_PARAM = "__metadata_param_";
    private static readonly KEY_HTTP_METHOD = "__metadata_http_method_";
    private static readonly KEY_SERVER = util.format(Decorator.KEY_FORMAT, "server");
    private static readonly KEY_CONTROLLER = util.format(Decorator.KEY_FORMAT, "controller");
    private static readonly KEY_HTTP_METHOD_FORMAT = util.format(Decorator.KEY_FORMAT, "http_method_%s_%s");
    private static readonly KEY_PARAM_FORMAT = util.format(Decorator.KEY_FORMAT, "param_%s_%d");
    private static readonly FORMATS = [".js", ".ts"];

    // noinspection JSUnusedLocalSymbols
    private constructor() {
        // no-op
    }

    public static defineServer(target: any, options: ServerDecoratorOptions): void {
        Reflect.defineMetadata(Decorator.KEY_SERVER, options, target);
    }

    public static defineController(options: ControllerDecoratorOptions): Function {
        return function (target: any) {
            const metadataBuilder = new ControllerMetadataBuilder()
                .setRoute(options.route);
            Object.getOwnPropertyNames(target.prototype)
                .map(key => [key, Reflect.getMetadataKeys(target.prototype, key)])
                .map((map: [string, string[]]) => {
                    const [key, metadataKeys] = map;
                    return metadataKeys.filter(metadataKey => metadataKey.startsWith(Decorator.KEY_HTTP_METHOD))
                        .map(metadataKey => {
                            const httpMetadata = Reflect.getMetadata(metadataKey, target.prototype, key);
                            Reflect.deleteMetadata(metadataKey, target.prototype);
                            return httpMetadata;
                        });
                })
                .reduce((all, single) => all.concat(single), [])
                .forEach(metadata => metadataBuilder.addAction(metadata));
            Reflect.defineMetadata(Decorator.KEY_CONTROLLER, metadataBuilder, target);
        }
    }

    public static defineHttpMethod(actionName: HttpMethodName, route: RouteType): Function {
        return function (target: any, methodName: string, descriptor: PropertyDescriptor) {
            const metadataKey = util.format(Decorator.KEY_HTTP_METHOD_FORMAT, methodName, actionName);
            const injectParams = Reflect.getMetadataKeys(target, methodName)
                .filter(metadataKey => metadataKey.startsWith(Decorator.KEY_PARAM))
                .map(metadataKey => {
                    const metadata = Reflect.getMetadata(metadataKey, target, methodName) as ParamMetadata;
                    Reflect.deleteMetadata(metadataKey, target);
                    return metadata;
                })
                .sort((a, b) => a.paramIndex - b.paramIndex);
            const origMethod = descriptor.value as Function;
            const action = function (req: any, res: any, next: any, driver: Driver<any, any>) {
                const args = Decorator.getArguments(req, res, next, injectParams, driver);
                return origMethod.apply(target, args);
            };
            const actionMetadata = <HttpMethodMetadata> {
                route: route,
                actionName: actionName,
                action: action
            };
            Decorator.validatePathParams(injectParams, actionMetadata);
            Reflect.defineMetadata(metadataKey, actionMetadata, target, methodName);
            descriptor.value = action;
            return descriptor;
        }
    }

    private static validatePathParams(injectParams: ParamMetadata[], actionMetadata: HttpMethodMetadata) {
        injectParams
            .filter(metadata => metadata.injectType === "param")
            .forEach(metadata => {
                const regexp = new RegExp(`:\\b${metadata.paramName}\\b`);
                if (actionMetadata.route.toString().search(regexp) === -1) {
                    throw new Error(`Route "${actionMetadata.route}" doesn't contain \
path parameter "${metadata.paramName}"`);
                }
            });
        if (["put", "post"].indexOf(actionMetadata.actionName) === -1) {
            const hasBody = injectParams
                .filter(metadata => metadata.injectType === "body")
                .length > 0;
            if (hasBody) {
                throw new Error(`Action "${actionMetadata.actionName}" can't inject "body". \
Maybe you want to use "post" or "put" instead?`);
            }
        }
    }

    public static defineParameter(target: any, methodName: string, metadata: ParamMetadata): void {
        const metadataKey = util.format(Decorator.KEY_PARAM_FORMAT, methodName, metadata.paramIndex);
        Reflect.defineMetadata(metadataKey, metadata, target, methodName);
    }

    public static configureServer<T>(server: Server<T>, driver: Driver<T, any>): void {
        const options = Reflect.getMetadata(Decorator.KEY_SERVER, server.constructor) as ServerDecoratorOptions;
        const controllers = Decorator.loadControllers(options);
        driver.configureApp(options, controllers);
    }

    private static loadControllers(options: ServerDecoratorOptions): ControllerMetadata[] {
        if (options.controllers) {
            return options.controllers
                .map((val: {[version: string]: string[]}) => {
                    return Object.keys(val)
                        .map(version => Decorator.loadController(options.routePrefix || "", version, val[version]));
                })
                .reduce((all, single) => all.concat(single), [] as ControllerMetadata[][])
                .reduce((all, single) => all.concat(single), [] as ControllerMetadata[]);
        }
        return [];
    }

    private static loadController(prefix: string, version: string, files: string[]): ControllerMetadata[] {
        const allFiles = files.reduce(
            (allFiles, file) => {
                const filePath = path.normalize(file);
                return allFiles.concat(glob.sync(filePath));
            },
            [] as string[]
        );
        return allFiles
            .filter(file => {
                const dtsExtension = file.substring(file.length - 5, file.length);
                return Decorator.FORMATS.indexOf(path.extname(file)) !== -1 && dtsExtension !== ".d.ts";
            })
            .map(file => require(file))
            .map(exported => exported.default)
            .map(constructor => Reflect.getMetadata(Decorator.KEY_CONTROLLER, constructor) as ControllerMetadataBuilder)
            .map(builder => builder.setVersion(version).setPrefix(prefix).build());
    }

    private static getArguments<T, Rq>(req: any, res: any, next: any,
                                injectParams: ParamMetadata[], driver: Driver<T, Rq>): any[] {
        return injectParams
            .map(metadata => Decorator.getArgument(req, res, next, metadata, driver))
            .reduce((all, single) => all.concat(single), []);
    }

    private static getArgument<T, Rq>(req: Rq, res: any, next: any,
                                      metadata: ParamMetadata, driver: Driver<T, Rq>): any {
        switch (metadata.injectType) {
            case "req": {
                return req;
            }
            case "res": {
                return res;
            }
            case "next": {
                return next;
            }
            default: {
                return driver.getArgument(req, metadata.injectType, metadata.paramName);
            }
        }
    }
}