import {Module} from "../../../di/decorators/class.module.decorator";
import {Provides} from "../../../di/decorators/method.provides.decorator";
import {TypeUtils} from "../../../server/core/internal/utils/type.utils";
import {TypeUtilsImpl} from "../../../server/core/internal/utils/type.utils.impl";
import {ExpressConverter} from "../../models/express.converter";

/**
 * @internal
 */
@Module()
export class SharedModule {

    //noinspection JSUnusedGlobalSymbols
    @Provides()
    public static provideExpressConverter(): ExpressConverter {
        return new ExpressConverter();
    }

    //noinspection JSUnusedGlobalSymbols
    @Provides()
    public static provideTypeUtils(): TypeUtils {
        return new TypeUtilsImpl();
    }

    //noinspection JSUnusedLocalSymbols
    private constructor() {

    }
}