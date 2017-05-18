import {ResultSaver} from "../types/result-saver";
import {Route} from "../types/route.type";
import {SimpleMiddleware} from "./abs.middleware";
import {RouterAdapter} from "./abs.router.adapter";

export abstract class Driver {

    public abstract start(port: number, hostname: string): Promise<void>;

    public abstract newRouter(): RouterAdapter;

    public abstract registerRouter(route: Route, routerAdapter: RouterAdapter): void;

    public abstract registerErrorMiddleware(middleware: SimpleMiddleware): void;

    public abstract getResultSaver(): ResultSaver;

    public abstract get nextSetter(): (middleware: SimpleMiddleware) => SimpleMiddleware;
}