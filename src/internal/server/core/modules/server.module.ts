import {Module} from "../../../../public/di/decorators/class.module.decorator";
import {Provides} from "../../../../public/di/decorators/method.provides.decorator";
import {SimpleMiddleware} from "../../../../public/server/core/models/base/abs.middleware";
import {DefaultAuthorizationMiddleware} from "../middlewares/def.authorization.middleware";
import {DefaultResponseHandlerMiddleware} from "../middlewares/def.no-handler.middleware";

/**
 * @internal
 */
@Module()
export class CoreServerModule {

    //noinspection JSUnusedGlobalSymbols
    @Provides("def.auth-handler.middleware")
    public static provideDefaultAuthorizationHandlerMiddleware(): SimpleMiddleware {
        return new DefaultAuthorizationMiddleware();
    }

    //noinspection JSUnusedGlobalSymbols
    @Provides("def.response-handler.middleware")
    public static provideDefaultResponseHandlerMiddleware(): SimpleMiddleware {
        return new DefaultResponseHandlerMiddleware();
    }

    //noinspection JSUnusedLocalSymbols
    private constructor() {

    }
}