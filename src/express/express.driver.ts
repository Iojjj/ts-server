import express = require("express");
import {isArray} from "util";
import {AbstractDriver} from "../../core/server.driver";
import {ServerOptions} from "../../core/decorators/server/server.options";
import {ControllerMetadata} from "../../core/decorators/controller/controller.metadata";
import {Logger} from "../../core/utils/logger";

const compression = require("compression");
const bodyParser = require("body-parser");
const session = require("express-session");

export class ExpressDriver extends AbstractDriver<express.Application> {

    public constructor(app?: express.Application) {
        super(app || express());
    }

    public configureApp(options: ServerOptions, controllers: ControllerMetadata[]): void {
        super.configureApp(options, controllers);
        this.application.use(compression());
        this.application.use(bodyParser.json());
        this.application.use(bodyParser.urlencoded({extended: true}));
        this.application.use(session({
            resave: false,
            secret: "s3cr3t",
            saveUninitialized: true
        }));
    }

    protected configureControllers(controllers: ControllerMetadata[]) {
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
                    AbstractDriver.fixPath(metadata.prefix),
                    AbstractDriver.fixPath(metadata.version),
                    AbstractDriver.fixPath(r.toString())
                ].join("");
                Logger.console().d(`registering controller with route "${route}"`);
                metadata.httpMethods.forEach(httpMetadata => {
                    (router as any)[httpMetadata.httpMethodName](httpMetadata.route,
                        (req: any, res: any, next: (err?: any) => any) => {
                            httpMetadata.action.use(req, res, next);
                        }
                    );
                    Logger.console()
                        .d(`registered route "${httpMetadata.httpMethodName.toUpperCase()} - ${httpMetadata.route}"`);
                });
                this.application.use(route, router);
            });
        });
    }

    protected setupTrustProxy(options: ServerOptions): void {
        if (options.trustProxy) {
            this.application.set("trust proxy", options.trustProxy);
        }
    }

    protected setupCaseSensitiveRouting(options: ServerOptions) {
        if (options.caseSensitiveRouting !== undefined) {
            this.application.set("case sensitive routing", options.caseSensitiveRouting);
        }
    }

    protected setupViewCache(options: ServerOptions) {
        if (options.viewCache !== undefined) {
            this.application.set("view cache", options.viewCache);
        }
    }

    protected setupViews(options: ServerOptions) {
        if (options.views) {
            this.application.set("views", options.views);
        }
    }

    protected setupViewEngines(options: ServerOptions) {
        const viewEngine = options.viewEngine;
        if (viewEngine) {
            Object
                .keys(viewEngine)
                .forEach(key => this.application.engine(key, viewEngine[key]));
        }
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