import {Module} from "../../src/public/di/decorators/class.module.decorator";
import {Provides} from "../../src/public/di/decorators/method.provides.decorator";

@Module()
export class SecondModule {

    //noinspection JSUnusedGlobalSymbols
    @Provides("another number")
    public static provideAnotherNumber(): number {
        return 5;
    }
}