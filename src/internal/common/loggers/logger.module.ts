import {Module} from "@ts-server/di/decorators/class.module.decorator";
import {Provides} from "@ts-server/di/decorators/method.provides.decorator";

/**
 * @internal
 */
@Module()
class LoggerModule {

    //noinspection JSUnusedGlobalSymbols
    @Provides("labeled-logger.date")
    public static provideDate(): Date {
        return new Date();
    }

    //noinspection JSUnusedLocalSymbols
    private constructor() {

    }
}

export default LoggerModule;