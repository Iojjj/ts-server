import {ServerOptions} from "./decorators/server/server.options";
import {ControllerMetadata} from "./decorators/controller/controller.metadata";
import {Logger} from "./utils/logger";

export interface Driver<A> {

    readonly application: A;

    configureApp(options: ServerOptions, controllers: ControllerMetadata[]): void;

    start(port?: number, hostname?: string, callback?: (port: number, hostname: string) => void): void;
}

export abstract class AbstractDriver<A> implements Driver<A> {

    private readonly _application: A;
    private _routePrefix: string | undefined;

    constructor(application: A) {
        this._application = application;
    }

    protected get routePrefix(): string | undefined {
        return this._routePrefix;
    }

    protected setupRoutePrefix(options: ServerOptions) {
        if (options.routePrefix) {
            this._routePrefix = options.routePrefix;
        }
    }

    public get application(): A {
        return this._application;
    }

    public configureApp(options: ServerOptions, controllers: ControllerMetadata[]): void {
        this.setupViewEngines(options);
        this.setupViews(options);
        this.setupViewCache(options);
        this.setupCaseSensitiveRouting(options);
        this.setupTrustProxy(options);
        this.setupRoutePrefix(options);
        this.configureControllers(controllers);
    }

    protected abstract setupViewEngines(options: ServerOptions): void;

    protected abstract setupViews(options: ServerOptions): void;

    protected abstract setupViewCache(options: ServerOptions): void;

    protected abstract setupCaseSensitiveRouting(options: ServerOptions): void;

    protected abstract setupTrustProxy(options: ServerOptions): void;

    protected abstract configureControllers(controllers: ControllerMetadata[]): void;

    public abstract start(port?: number, hostname?: string, callback?: () => void): void;

    protected static fixPath(path: string): string {
        if (!path) {
            Logger.console().w(new Error(`Invalid path: "${path}"`));
            return "";
        }
        return path.startsWith("/") ? path : "/" + path;
    }
}