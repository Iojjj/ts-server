import express = require("express");
import {Component} from "../../di/decorators/class.component.decorator";
import {Inject} from "../../di/decorators/prop.inject.decorator";
import {SimpleMiddleware} from "../../server/core/models/base/abs.middleware";
import {Server} from "../../server/core/models/base/abs.server";
import {AcceptsMiddlewareProvider} from "../../server/core/models/types/accepts-middleware-provider.type";
import {ExpressServerModule} from "../../../internal/server-express/modules/express-server.module";
import {DefaultAcceptsLanguagesMiddleware} from "./middlewares/def.accepts-languages.middleware";
import {DefaultAcceptsMiddleware} from "./middlewares/def.accepts.middleware";
import {ExpressDriver} from "./express.driver";

/**
 * Implementation of server based on express.js.
 */
@Component(ExpressServerModule)
export abstract class ExpressServer extends Server {

    @Inject()
    private driver: ExpressDriver;

    @Inject("middlewares")
    private middlewares: SimpleMiddleware[];

    @Inject("response-handler.middlewares")
    private responseHandlers: SimpleMiddleware[];

    protected provideDriver(): ExpressDriver {
        return this.driver;
    }

    protected provideMiddlewares(): SimpleMiddleware[] {
        return this.middlewares;
    }

    protected provideResponseHandlers(): SimpleMiddleware[] {
        return this.responseHandlers;
    }

    protected provideAcceptsTypesProvider(): AcceptsMiddlewareProvider {
        return (values) => new DefaultAcceptsMiddleware(values);
    }

    protected provideAcceptsLanguagesProvider(): AcceptsMiddlewareProvider {
        return (values) => new DefaultAcceptsLanguagesMiddleware(values);
    }
}