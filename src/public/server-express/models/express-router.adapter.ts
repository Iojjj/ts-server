import e = require("express");
import {Component} from "../../di/decorators/class.component.decorator";
import {Inject} from "../../di/decorators/prop.inject.decorator";
import {RouterAdapter} from "../../server/core/models/base/abs.router.adapter";
import {MethodType} from "../../server/core/models/types/method-type";
import {Route} from "../../server/core/models/types/route.type";
import {ExpressMiddleware} from "../../../internal/server-express/middlewares/abs.express.middleware";
import {ExpressRouterModule} from "../../../internal/server-express/modules/express-router.module";
import {SharedModule} from "../../../internal/server-express/modules/shared.module";
import {ExpressConverter} from "./express.converter";

@Component(ExpressRouterModule, SharedModule)
export class ExpressRouterAdapter extends RouterAdapter {

    @Inject("express.router")
    private _router: e.Router & Record<string, e.IRouterHandler<any> & e.IRouterMatcher<any>>;

    @Inject()
    private converter: ExpressConverter;

    public registerRoute(methodType: MethodType, route: Route, middleware: ExpressMiddleware): void {
        const methodName = methodType.toString().toLowerCase();
        const handler = this.converter.fromDriverMiddleware(middleware, false);
        this._router[methodName](route, handler);
    }

    public get router(): e.Router & Record<string, e.IRouterHandler<any> & e.IRouterMatcher<any>> {
        return this._router;
    }
}