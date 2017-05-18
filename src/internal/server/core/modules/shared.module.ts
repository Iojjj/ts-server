import {Module} from "../../../../public/di/decorators/class.module.decorator";
import {Provides} from "../../../../public/di/decorators/method.provides.decorator";
import {Singleton} from "../../../../public/di/decorators/method.singleton.decorator";
import {DefaultTypeTransformer} from "../../../../public/type-transformation/models/def.type-transformer";
import {TypeTransformer} from "../../../../public/type-transformation/models/type-transformer";
import {RouteUtils} from "../utils/route.utils";
import {RouteUtilsImpl} from "../utils/route.utils.impl";
import {TypeUtils} from "../utils/type.utils";
import {TypeUtilsImpl} from "../utils/type.utils.impl";
import Logger from "../../../../public/common/loggers/abs.logger";
import ConsoleLogger from "../../../../public/common/loggers/console.logger";

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