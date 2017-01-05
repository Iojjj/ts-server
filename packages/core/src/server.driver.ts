import {ServerDecoratorOptions} from "./decorators/server.decorator";
import {ControllerMetadata} from "./decorators/controller.metadata";
import {ParamType} from "./server.types";

export interface Driver<A, Rq> {

    readonly application: A;

    configureApp(options: ServerDecoratorOptions, controllers: ControllerMetadata[]): void;

    getArgument(req: Rq, paramType: ParamType, paramName: string): any;

    start(port?: number, hostname?: string, callback?: (port: number, hostname: string) => void): void;
}

export abstract class AbstractDriver<A, Rq> implements Driver<A, Rq> {

    private readonly _application: A;
    private _routePrefix: string | undefined;

    constructor(application: A) {
        this._application = application;
    }

    protected get routePrefix(): string | undefined {
        return this._routePrefix;
    }

    protected setupRoutePrefix(options: ServerDecoratorOptions) {
        if (options.routePrefix) {
            this._routePrefix = options.routePrefix;
        }
    }

    public get application(): A {
        return this._application;
    }

    public abstract configureApp(options: ServerDecoratorOptions, controllers: ControllerMetadata[]): void;

    public abstract getArgument(req: Rq, paramType: ParamType, paramName: string): any;

    public abstract start(port?: number, hostname?: string, callback?: () => void): void;
}