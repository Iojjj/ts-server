import {Module} from "../../../di/decorators/class.module.decorator";
import {Provides} from "../../../di/decorators/method.provides.decorator";

/**
 * @internal
 */
@Module()
export class LoggerModule {

    //noinspection JSUnusedGlobalSymbols
    @Provides()
    public static provideDate(): Date {
        return new Date();
    }

    //noinspection JSUnusedLocalSymbols
    private constructor() {

    }
}