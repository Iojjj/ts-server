import {Module} from "../../../di/decorators/class.module.decorator";
import {Provides} from "../../../di/decorators/method.provides.decorator";
import {DefaultAuthorizationMiddleware} from "../../../server/core/internal/middlewares/def.authorization.middleware";
import {DefaultResponseHandlerMiddleware} from "../../../server/core/internal/middlewares/def.no-handler.middleware";
import {SimpleMiddleware} from "../../../server/core/models/base/abs.middleware";
import {DefaultErrorHandlerMiddleware} from "../../models/middlewares/def.error-handler.middleware";
import {DefaultJsonHandlerMiddleware} from "../../models/middlewares/def.json-handler.middleware";
import {DefaultRawHandlerMiddleware} from "../../models/middlewares/def.raw-handler.middleware";
import {ExpressDriver} from "../../models/express.driver";

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