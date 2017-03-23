import {Component} from "../../di/decorators/class.component.decorator";
import {Inject} from "../../di/decorators/prop.inject.decorator";
import {Named} from "../../di/decorators/prop.named.decorator";
import {Provider} from "../../di/models/abs.provider";
import {Driver} from "../../server/core/models/base/abs.driver";
import {SimpleMiddleware} from "../../server/core/models/base/abs.middleware";
import {ResultSaver} from "../../server/core/models/types/result-saver";
import {Route} from "../../server/core/models/types/route.type";
import {ExpressErrorMiddleware} from "../internal/middlewares/abs.express-error.middleware";
import {ExpressDriverModule} from "../internal/modules/express-driver.module";
import {NextSetterMiddleware} from "../internal/middlewares/express.next-setter.middleware";
import {SharedModule} from "../internal/modules/shared.module";
import {ExpressRouterAdapter} from "./express-router.adapter";
import {ExpressConverter} from "./express.converter";
import e = require("express");

@Component(ExpressDriverModule, SharedModule)
export class ExpressDriver extends Driver {

    @Inject() @Named("express.app")
    private app: e.Application;

    @Inject() @Named(ExpressRouterAdapter)
    private routerProvider: Provider<ExpressRouterAdapter>;

    @Inject()
    private converter: ExpressConverter;

    public start(port: number, hostname: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.app.listen(port, hostname, (err?: Error) => {
                if (err) {
                    return reject(err);
                }
                return resolve();
            });
        });
    }

    public registerErrorMiddleware(middleware: ExpressErrorMiddleware): void {
        const handler = this.converter.fromDriverErrorMiddleware(middleware);
        this.app.use(handler);
    }

    public newRouter(): ExpressRouterAdapter {
        return this.routerProvider.get();
    }

    public registerRouter(route: Route, adapter: ExpressRouterAdapter): void {
        // TODO
        this.app.use(route, adapter.router);
    }

    public getResultSaver(): ResultSaver {
        return (result: any, req: e.Request, res: e.Response): void => {
            const anyRes = res as any;
            const state = anyRes.state || {};
            state.result = result;
            anyRes.state = state;
        };
    }

    public get nextSetter(): (middleware: SimpleMiddleware) => SimpleMiddleware {
        return (middleware) => {
            return new NextSetterMiddleware(middleware);
        };
    }
}