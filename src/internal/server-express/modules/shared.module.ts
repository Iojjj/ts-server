import {Module} from "../../../public/di/decorators/class.module.decorator";
import {Provides} from "../../../public/di/decorators/method.provides.decorator";
import {TypeUtils} from "../../server/core/utils/type.utils";
import {TypeUtilsImpl} from "../../server/core/utils/type.utils.impl";
import {ExpressConverter} from "../../../public/server-express/models/express.converter";

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