import {Logger} from "../../../../common/loggers/abs.logger";
import {ConsoleLogger} from "../../../../common/loggers/console.logger";
import {Module} from "../../../../di/decorators/class.module.decorator";
import {Provides} from "../../../../di/decorators/method.provides.decorator";
import {Singleton} from "../../../../di/decorators/method.singleton.decorator";
import {DefaultTypeTransformer} from "../../../../type-transformation/models/def.type-transformer";
import {TypeTransformer} from "../../../../type-transformation/models/type-transformer";
import {RouteUtils} from "../utils/route.utils";
import {RouteUtilsImpl} from "../utils/route.utils.impl";
import {TypeUtils} from "../utils/type.utils";
import {TypeUtilsImpl} from "../utils/type.utils.impl";

/**
 * @internal
 */
@Module()
export class CoreSharedModule {

    //noinspection JSUnusedGlobalSymbols
    @Provides() @Singleton()
    public static provideTypeUtils(): TypeUtils {
        return new TypeUtilsImpl();
    }

    //noinspection JSUnusedGlobalSymbols
    @Provides() @Singleton()
    public static provideRouteUtils(): RouteUtils {
        return new RouteUtilsImpl();
    }

    //noinspection JSUnusedGlobalSymbols
    @Provides() @Singleton()
    public static provideTypeTransformer(): TypeTransformer {
        return new DefaultTypeTransformer();
    }

    //noinspection JSUnusedGlobalSymbols
    @Provides() @Singleton()
    public static provideLogger(): Logger {
        return ConsoleLogger.newInstance("server:");
    }

    //noinspection JSUnusedLocalSymbols
    private constructor() {

    }
}