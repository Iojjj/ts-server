import {Logger} from "../../../../common/loggers/abs.logger";
import {Component} from "../../../../di/decorators/class.component.decorator";
import {Inject} from "../../../../di/decorators/prop.inject.decorator";
import {ControllerMetadata} from "../../../../../internal/server/decorators/metadata/controller-metadata.bean";
import {DecoratorUtils} from "../../../../../internal/server/decorators/utils/decorator.utils";
import {MethodMetadata} from "../../../../../internal/server/decorators/metadata/method-metadata.bean";
import {MiddlewareMetadata} from "../../../../../internal/server/decorators/metadata/middleware-metadata.bean";
import {ResponseHandlerMetadata} from "../../../../../internal/server/decorators/metadata/response-handler-metadata.bean";
import {RouteConfiguration} from "../../../../../internal/server/decorators/metadata/route-configuration.bean";
import {InjectableMethodMiddleware} from "../../../../../internal/server/core/middlewares/injectable-method.middleware";
import {InjectableMiddleware} from "../../../../../internal/server/core/middlewares/injectable.middleware";
import {RouteUtils} from "../../../../../internal/server/core/utils/route.utils";
import {CoreServerModule} from "../../../../../internal/server/core/modules/server.module";
import {CoreSharedModule} from "../../../../../internal/server/core/modules/shared.module";
import {SingleShotResetterMiddleware} from "../../../../../internal/server/core/middlewares/single-shot-resetter.middleware";
import {SingleShotMiddleware} from "../../../../../internal/server/core/middlewares/single-shot.middleware";
import {ServerOptions} from "../options/server-options";
import {AcceptsMiddlewareProvider} from "../types/accepts-middleware-provider.type";
import {ResponseType} from "../types/response-type";
import {Route} from "../types/route.type";
import {AcceptsMiddleware} from "./abs.accepts.middleware";
import {Driver} from "./abs.driver";
import {SimpleMiddleware} from "./abs.middleware";
import {RouterAdapter} from "./abs.router.adapter";
import {CompositeMiddleware} from "./composite.middleware";

@Component(CoreServerModule, CoreSharedModule)
export abstract class Server {

    private static readonly DEFAULT_PORT = 3000;
    private static readonly DEFAULT_HOSTNAME = "localhost";
    private static readonly ANY_VERSION = "*";
    private static readonly DEFAULT_OPTIONS: ServerOptions = {
        port: Server.DEFAULT_PORT,
        hostname: Server.DEFAULT_HOSTNAME,
    };

    @Inject()
    private readonly _logger: Logger;

    @Inject()
    private readonly _routeUtils: RouteUtils;

    @Inject("def.auth-handler.middleware")
    private readonly _defAuthHandlerMiddleware: SimpleMiddleware;

    @Inject("def.response-handler.middleware")
    private readonly _defRespHandlerMiddleware: SimpleMiddleware;

    private readonly _options: ServerOptions;
    private readonly _driver: Driver;
    private readonly _controllers: Object[];
    private readonly _middlewares: SimpleMiddleware[];
    private readonly _responseHandlers: Map<ResponseType, SimpleMiddleware> = new Map();
    private readonly _errorHandlerMiddleware: SimpleMiddleware | undefined;
    private readonly _acceptsTypesProvider: AcceptsMiddlewareProvider | undefined;
    private readonly _acceptsLanguagesProvider: AcceptsMiddlewareProvider | undefined;

    constructor() {
        this._options = this.provideOptions() || Server.DEFAULT_OPTIONS;
        this._driver = this.provideDriver();
        this._controllers = this.provideControllers() || [];
        this._middlewares = this.provideMiddlewares() || [];
        this._defAuthHandlerMiddleware = this.getAuthMiddleware();
        this._errorHandlerMiddleware = this.getErrorMiddleware();
        this._acceptsTypesProvider = this.provideAcceptsTypesProvider();
        this._acceptsLanguagesProvider = this.provideAcceptsLanguagesProvider();
        this.updateResponseHandlerMiddlewares();

        if (!this._driver) {
            throw new Error(`You must provide a driver.`);
        }
    }

    private getAuthMiddleware(): SimpleMiddleware {
        let authMiddleware = this._defAuthHandlerMiddleware;
        // update authorization handler middleware
        const authMiddlewares = this._middlewares
            .filter(m => DecoratorUtils.isAuthorizationHandlerMiddleware(m));
        if (authMiddlewares.length > 1) {
            throw new Error(`Multiple authorization handler middlewares found.`);
        }
        if (authMiddlewares.length === 1) {
            authMiddleware = authMiddlewares[0];
            this.removeMiddleware(authMiddlewares[0]);
        }
        return authMiddleware;
    }

    private getErrorMiddleware(): SimpleMiddleware | undefined {
        let errorMiddleware = this._errorHandlerMiddleware;
        // update error handler middleware
        const errorMiddlewares = this._middlewares
            .filter(m => DecoratorUtils.isErrorHandlerMiddleware(m));
        if (errorMiddlewares.length > 1) {
            throw new Error(`Multiple error handler middlewares found.`);
        }
        if (errorMiddlewares.length === 1) {
            errorMiddleware = errorMiddlewares[0];
            this.removeMiddleware(errorMiddlewares[0]);
        }
        if (errorMiddleware) {
            const metadata = DecoratorUtils.getErrorHandlerMetadata(errorMiddleware);
            errorMiddleware = new InjectableMiddleware(metadata, errorMiddleware);
        }
        return errorMiddleware;
    }

    private updateResponseHandlerMiddlewares(): void {
        const responseHandlers = this.provideResponseHandlers();
        if (!responseHandlers || responseHandlers.length === 0) {
            return;
        }
        responseHandlers
            .filter(m => DecoratorUtils.isResponseHandlerMiddleware(m))
            .forEach(m => {
                const metadata = DecoratorUtils.getResponseHandlerMetadata(m) as ResponseHandlerMetadata;
                const registeredHandler = this._responseHandlers.get(metadata.responseType);
                if (!!registeredHandler) {
                    throw new Error(`Error handler for ${metadata.responseType} already registered.`);
                }
                this._responseHandlers.set(metadata.responseType, m);
            });
    }

    private removeMiddleware(middleware: SimpleMiddleware): void {
        const index = this._middlewares.indexOf(middleware);
        this._middlewares.splice(index, 1);
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * Start server on default hostname with default port.
     * @return {Promise<string>} address where server is accessible
     */
    public start(): Promise<string> {
        const port = this._options.port || Server.DEFAULT_PORT;
        const hostname = this._options.hostname || Server.DEFAULT_HOSTNAME;
        this.onBeforeRegisterControllers();
        this.registerControllers();
        this.onAfterRegisterControllers();
        this.registerErrorHandlerMiddleware();
        return this._driver.start(port, hostname)
            .then(() => {
                const address = `${hostname}:${port}`;
                this._logger.d("started at", address);
                return address;
            });
    }

    /**
     * Called before registering controllers.
     */
    protected onBeforeRegisterControllers(): void {
    }

    /**
     * Called after controllers registered.
     */
    protected onAfterRegisterControllers(): void {
    }

    private registerErrorHandlerMiddleware(): void {
        if (!this._errorHandlerMiddleware) {
            this._logger.w("Error handler middleware not provided.");
            return;
        }
        this._driver.registerErrorMiddleware(this._errorHandlerMiddleware);
    }

    private registerControllers(): void {
        if (!this._controllers || this._controllers.length === 0) {
            throw new Error("Controllers are not provided.");
        }
        const metadata = this._controllers.map(controller => DecoratorUtils.getControllerMetadata(controller));
        const versions = metadata
            .map(m => m.version)
            .filter(v => !!v && v !== Server.ANY_VERSION);
        const uniqueVersions = new Set(versions);
        const globalMiddlewares = this._middlewares;
        this._logger.i("---------", "controllers configuration", "----------");
        metadata.forEach((metadata, index) => {
            if (index > 0) {
                this._logger.i("----------------------------------------------");
            }
            this.registerController(this._controllers[index], metadata, uniqueVersions, globalMiddlewares);
        });
        this._logger.i("---------", "controllers configuration", "----------");
    }

    private registerController(controller: Object, metadata: ControllerMetadata,
                               uniqueVersions: Set<Route>,
                               globalMiddlewares: SimpleMiddleware[]) {
        let allowedVersions: Set<Route>;
        if (metadata.version === Server.ANY_VERSION) {
            allowedVersions = uniqueVersions;
        } else {
            allowedVersions = new Set([metadata.version]);
        }
        // register router for all allowed versions
        allowedVersions.forEach(v => {
            const route = this._routeUtils.constructRoute(v, metadata.route);
            this._logger.i("--- controller ---", route);
            metadata.methodMetadata
                .forEach(methodMetadata => {
                    const router = this._driver.newRouter();
                    this._driver.registerRouter(route, router);
                    this.registerSubRoutes(controller, router, methodMetadata, globalMiddlewares);
                });
        });
    }

    private registerSubRoutes(controller: Object, router: RouterAdapter, metadata: MethodMetadata,
                              globalMiddlewares: SimpleMiddleware[]): void {
        // wrapping method into middleware
        const injectedMethod = new InjectableMethodMiddleware(metadata, controller, this._driver.getResultSaver());
        const methodMiddlewares = [];
        if (metadata.isAuthorizationRequired) {
            const authMiddleware = this.injectAuthorizationHandlersMiddlewares([this._defAuthHandlerMiddleware]);
            methodMiddlewares.push(authMiddleware[0]);
        }
        methodMiddlewares.push(injectedMethod);
        let acceptsMiddlewares: SimpleMiddleware[] = [];
        if (metadata.acceptsTypes.length > 0) {
            if (!this._acceptsTypesProvider) {
                throw new Error(`${metadata.targetName}.${metadata.methodName}: accepts types handler required, `
                    + `but provider is not specified. Override "provideAcceptsTypesProvider" of your Server class.`);
            }
            acceptsMiddlewares.push(this._acceptsTypesProvider(metadata.acceptsTypes));
        }
        if (metadata.acceptsLanguages.length > 0) {
            if (!this._acceptsLanguagesProvider) {
                throw new Error(`${metadata.targetName}.${metadata.methodName}: accepts languages handler required, but`
                    + ` provider is not specified. Override "provideAcceptsLanguagesProvider" of your Server class.`);
            }
            acceptsMiddlewares.push(this._acceptsLanguagesProvider(metadata.acceptsLanguages));
        }
        // injecting middlewares before registering
        acceptsMiddlewares = this.injectMiddlewares(acceptsMiddlewares);
        const beforeMiddlewares = this.injectMiddlewares(metadata.beforeMiddlewares);
        const afterMiddlewares = this.injectMiddlewares(metadata.afterMiddlewares);
        const global = this.injectMiddlewares(globalMiddlewares);
        // preparing list of all middlewares on the route
        const middlewares = [
            ...global,
            ...acceptsMiddlewares,
            ...beforeMiddlewares,
            ...methodMiddlewares,
            ...afterMiddlewares];
        metadata.routes.forEach(routeConfig => this.registerRoute(routeConfig, middlewares, router));
    }

    private registerRoute(routeConfig: RouteConfiguration, middlewares: SimpleMiddleware[], router: RouterAdapter) {
        // pick first handler...
        let handler = [
            this._responseHandlers.get(routeConfig.responseType),
            this._responseHandlers.get(ResponseType.ANY),
        ].filter(h => !!h).shift();
        // ...or set a default one
        handler = handler || this._defRespHandlerMiddleware;
        const handlers = this.injectResponseHandlerMiddlewares([handler]);

        const route = this._routeUtils.constructRoute(routeConfig.route);
        this._logger.i("---  subroute  ---", routeConfig.type.toString(), route);

        // create list of chainable middlewares
        const allMiddlewares = [...middlewares, ...handlers]
            .map(m => new SingleShotMiddleware(m));
        const routeMiddlewares: SimpleMiddleware[] = new Array(allMiddlewares.length);
        for (let i = allMiddlewares.length - 1; i >= 0; i--) {
            if (i === allMiddlewares.length - 1) {
                routeMiddlewares[i] = allMiddlewares[i];
                continue;
            }
            const last = allMiddlewares[i];
            const nextPart = routeMiddlewares.slice(i + 1, routeMiddlewares.length);
            const next = CompositeMiddleware.from(nextPart);
            const nextSetter = this._driver.nextSetter(next);
            routeMiddlewares[i] = CompositeMiddleware.of(nextSetter, last);
        }
        const compositeMiddleware = CompositeMiddleware.from(routeMiddlewares);
        const resettableMiddleware = new SingleShotResetterMiddleware(compositeMiddleware, allMiddlewares);
        router.registerRoute(routeConfig.type, route, resettableMiddleware);
    }

    private injectAuthorizationHandlersMiddlewares(middlewares: SimpleMiddleware[]): SimpleMiddleware[] {
        return this.injectMiddlewaresInt(middlewares,
            DecoratorUtils.isAuthorizationHandlerMiddleware, DecoratorUtils.getAuthorizationMetadata);
    }

    private injectResponseHandlerMiddlewares(middlewares: SimpleMiddleware[]): SimpleMiddleware[] {
        return this.injectMiddlewaresInt(middlewares,
            DecoratorUtils.isResponseHandlerMiddleware, DecoratorUtils.getResponseHandlerMetadata);
    }

    private injectMiddlewares(middlewares: SimpleMiddleware[]): SimpleMiddleware[] {
        return this.injectMiddlewaresInt(middlewares,
            DecoratorUtils.isMiddleware, DecoratorUtils.getMiddlewareMetadata);
    }

    private injectMiddlewaresInt(middlewares: SimpleMiddleware[],
                                 validator: (m: SimpleMiddleware) => boolean,
                                 extractor: (m: SimpleMiddleware) => MiddlewareMetadata): SimpleMiddleware[] {
        middlewares.forEach(m => {
            const isMiddleware = validator(m);
            if (!isMiddleware) {
                throw new Error(`${m.constructor.name} is not decorated with @Middleware decorator.`);
            }
        });
        return middlewares.map(m => {
            const metadata = extractor(m);
            return new InjectableMiddleware(metadata, m);
        });
    }

    /**
     * Provider server configuration options.
     */
    protected abstract provideOptions(): ServerOptions;

    /**
     * Provide driver.
     */
    protected abstract provideDriver(): Driver;

    /**
     * Provide list of controllers.
     */
    protected abstract provideControllers(): Object[];

    /**
     * Provide list of global middlewares.
     * This list can contain {@link AuthorizationHandlerMiddleware} or {@link ErrorHandlerMiddleware} middlewares.
     */
    protected abstract provideMiddlewares(): SimpleMiddleware[];

    /**
     * Provide list of response handler middlewares.
     * This list can contain only {@link ResponseHandlerMiddleware} middlewares.
     */
    protected abstract provideResponseHandlers(): SimpleMiddleware[];

    protected abstract provideAcceptsTypesProvider(): (values: string[]) => AcceptsMiddleware;

    protected abstract provideAcceptsLanguagesProvider(): (values: string[]) => AcceptsMiddleware;
}