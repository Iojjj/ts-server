import {LoggingMiddleware} from "./logging.middleware";
import {ServerModule} from "./server.module";
import {ExpressServer} from "../../src/public/server-express/models/express.server";
import {Component} from "../../src/public/di/decorators/class.component.decorator";
import {Inject} from "../../src/public/di/decorators/prop.inject.decorator";
import {ServerOptions} from "../../src/public/server/core/models/options/server-options";
import {SimpleMiddleware} from "../../src/public/server/core/models/base/abs.middleware";

@Component(ServerModule)
export class SampleServer extends ExpressServer {

    @Inject("controllers")
    private sampleControllers: any[];

    protected provideOptions(): ServerOptions {
        return <ServerOptions> {
            routePrefix: "api",
        };
    }

    protected provideMiddlewares(): SimpleMiddleware[] {
        return [
            ...super.provideMiddlewares(),
            new LoggingMiddleware(),
        ];
    }

    public provideControllers(): Object[] {
        return this.sampleControllers;
    }
}