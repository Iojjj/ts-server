import {Module} from "../../../public/di/decorators/class.module.decorator";
import {Provides} from "../../../public/di/decorators/method.provides.decorator";
import {DefaultAuthorizationMiddleware} from "../../server/core/middlewares/def.authorization.middleware";
import {DefaultResponseHandlerMiddleware} from "../../server/core/middlewares/def.no-handler.middleware";
import {SimpleMiddleware} from "../../../public/server/core/models/base/abs.middleware";
import {DefaultErrorHandlerMiddleware} from "../../../public/server-express/models/middlewares/def.error-handler.middleware";
import {DefaultJsonHandlerMiddleware} from "../../../public/server-express/models/middlewares/def.json-handler.middleware";
import {DefaultRawHandlerMiddleware} from "../../../public/server-express/models/middlewares/def.raw-handler.middleware";
import {ExpressDriver} from "../../../public/server-express/models/express.driver";

/**
 * @internal
 */
@Module()
export class ExpressServerModule {

    //noinspection JSUnusedGlobalSymbols
    @Provides()
    public static provideDriver(): ExpressDriver {
        return new ExpressDriver();
    }

    //noinspection JSUnusedGlobalSymbols
    @Provides("middlewares")
    public static provideMiddlewares(): SimpleMiddleware[] {
        return [new DefaultErrorHandlerMiddleware()];
    }

    //noinspection JSUnusedGlobalSymbols
    @Provides("response-handler.middlewares")
    public static provideResponseHandlerMiddlewares(): SimpleMiddleware[] {
        return [
            new DefaultRawHandlerMiddleware(),
            new DefaultJsonHandlerMiddleware(),
        ];
    }

    //noinspection JSUnusedGlobalSymbols
    @Provides("default.response-handler.middleware")
    public static provideResponseErrorHandler(): SimpleMiddleware {
        return new DefaultResponseHandlerMiddleware();
    }

    //noinspection JSUnusedGlobalSymbols
    @Provides("default.error-handler.middleware")
    public static provideDefaultErrorHandler(): SimpleMiddleware {
        return new DefaultErrorHandlerMiddleware();
    }

    //noinspection JSUnusedGlobalSymbols
    @Provides("default.auth-handler.middleware")
    public static provideDefaultAuthHandler(): SimpleMiddleware {
        return new DefaultAuthorizationMiddleware();
    }

    //noinspection JSUnusedLocalSymbols
    private constructor() {

    }
}