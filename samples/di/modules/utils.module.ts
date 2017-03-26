import {Logger} from "../../../src/common/loggers/abs.logger";
import {ConsoleLogger} from "../../../src/common/loggers/console.logger";
import {Provides} from "../../../src/di/decorators/method.provides.decorator";
import {Singleton} from "../../../src/di/decorators/method.singleton.decorator";
import {PromiseUtils} from "../utils/promise.utils";
import {PromiseUtilsImpl} from "../utils/promise.utils.impl";
import {PumpScope} from "../scopes/pump.scope";
import {HeaterScope} from "../scopes/heater.scope";
import {Module} from "../../../src/di/decorators/class.module.decorator";

@Module()
export class UtilsModule {

    //noinspection JSUnusedGlobalSymbols
    @Provides()
    @Singleton()
    public static providePromiseUtils(): PromiseUtils {
        return new PromiseUtilsImpl();
    }

    //noinspection JSUnusedGlobalSymbols
    @Provides("el-heater")
    @HeaterScope()
    public static provideElectricHeaterLogger(): Logger {
        return ConsoleLogger.newInstance("el-heater");
    }

    //noinspection JSUnusedGlobalSymbols
    @Provides("gas-heater")
    @HeaterScope()
    public static provideGasHeaterLogger(): Logger {
        return ConsoleLogger.newInstance("gas-heater");
    }

    //noinspection JSUnusedGlobalSymbols
    @Provides("siphon")
    @PumpScope()
    public static provideSiphonLogger(): Logger {
        return ConsoleLogger.newInstance("siphon");
    }

    //noinspection JSUnusedGlobalSymbols
    @Provides("t-siphon")
    @PumpScope()
    public static provideThermosiphonLogger(): Logger {
        return ConsoleLogger.newInstance("t-siphon");
    }

    //noinspection JSUnusedGlobalSymbols
    @Provides("coffee-maker")
    @Singleton()
    public static provideCoffeeMakerLogger(): Logger {
        return ConsoleLogger.newInstance("coffee-maker");
    }

    //noinspection JSUnusedLocalSymbols
    private constructor() {

    }
}