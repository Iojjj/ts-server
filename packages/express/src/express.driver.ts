import express = require("express");
import {AbstractDriver} from "../../core/src/server.driver";
import {ServerDecoratorOptions} from "../../core/src/decorators/server.decorator";
import {ControllerMetadata} from "../../core/src/decorators/controller.metadata";
import {ParamType} from "../../core/src/server.types";
import {Logger} from "../../core/src/logger";
import {isArray} from "util";

export class ExpressDriver extends AbstractDriver<express.Application, express.Request> {

    public constructor(app?: express.Application) {
        super(app || express());
    }

    public configureApp(options: ServerDecoratorOptions, controllers: ControllerMetadata[]): void {
        this.setupViewEngines(options);
        this.setupViews(options);
        this.setupViewCache(options);
        this.setupCaseSensitiveRouting(options);
        this.setupTrustProxy(options);
        this.setupRoutePrefix(options);
        this.configureControllers(controllers);
    }

    private configureControllers(controllers: ControllerMetadata[]) {
        controllers.map(metadata => {
            const router = express.Router();
            let routes: (string|RegExp)[];
            if (isArray(metadata.route)) {
                routes = metadata.route as (string|RegExp)[];
            } else {
                routes = [metadata.route as (string|RegExp)];
            }
            routes.forEach(r => {
                const route = [
                    this.path(metadata.prefix),
                    this.path(metadata.version),
                    this.path(r.toString())
                ].join("");
                Logger.console().log(`registering controller with route "${route}"`);
                metadata.httpMethods.forEach(httpMetadata => {
                    (router as any)[httpMetadata.httpMethodName](httpMetadata.route, (req: any, res: any, next: any) => {
                        httpMetadata.action(req, res, next, this);
                    });
                    Logger.console().log(`registered route "${httpMetadata.httpMethodName.toUpperCase()} - ${httpMetadata.route}"`);
                });
                this.application.use(route, router);
            });
        })
    }

    private path(path: string): string {
        return path.startsWith("/") ? path : "/" + path;
    }

    private setupTrustProxy(options: ServerDecoratorOptions) {
        if (options.trustProxy) {
            this.application.set("trust proxy", options.trustProxy);
        }
    }

    private setupCaseSensitiveRouting(options: ServerDecoratorOptions) {
        if (options.caseSensitiveRouting !== undefined) {
            this.application.set("case sensitive routing", options.caseSensitiveRouting);
        }
    }

    private setupViewCache(options: ServerDecoratorOptions) {
        if (options.viewCache !== undefined) {
            this.application.set("view cache", options.viewCache);
        }
    }

    private setupViews(options: ServerDecoratorOptions) {
        if (options.views) {
            this.application.set("views", options.views);
        }
    }

    private setupViewEngines(options: ServerDecoratorOptions) {
        const viewEngine = options.viewEngine;
        if (viewEngine) {
            Object
                .keys(viewEngine)
                .forEach(key => this.application.engine(key, viewEngine[key]));
        }
    }

    public getArgument(req: express.Request, paramType: ParamType, paramName: string): any {
        switch (paramType) {
            case "body": {
                if (paramName) {
                    // TODO: extract param name
                }
                return req.body;
            }
            case "query": {
                return req.query[paramName];
            }
            case "header": {
                return req.headers[paramName.toLowerCase()];
            }
            case "headers": {
                return req.headers;
            }
            case "file": {
                return (req as any).files[paramName];
            }
            case "files": {
                return (req as any).files;
            }
            case "param": {
                return req.params[paramName];
            }
            case "session": {
                if (paramName) {
                    return (req as any).session[paramName];
                }
                return (req as any).session;
            }
            case "cookie": {
                if (!req.headers["cookie"]) {
                    break;
                }
                if (!paramName) {
                    return req.headers["cookie"];
                }
                // TODO: extract cookie
                //const cookies = cookie.parse(req.headers.cookie);
                //return cookies[paramName];
            }
        }
        return undefined;
    }

    public start(port?: number, hostname?: string, callback?: (port: number, hostname: string) => void): void {
        const p = port !== undefined ? port : 3000;
        const cb = (port: number, hostname: string) => {
            if (callback) {
                callback(port, hostname);
            }
        };
        if (!hostname) {
            this.application.listen(p, () => cb(p, "localhost"));
        } else {
            this.application.listen(p, hostname, () => cb(p, hostname));
        }
    }
}