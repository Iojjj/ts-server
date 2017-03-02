import {Module} from "../../src/di/decorators/module/module.decorator";
import {Provides} from "../../src/di/decorators/module/provides.decorator";

@Module()
export class SecondModule {

    //noinspection JSUnusedGlobalSymbols
    @Provides("another number")
    public static provideAnotherNumber(): number {
        return 5;
    }
}