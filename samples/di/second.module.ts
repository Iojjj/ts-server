import {Module} from "../../framework/src/dependency-injection/decorators/module/module.decorator";
import {Provides} from "../../framework/src/dependency-injection/decorators/module/provides.decorator";

@Module()
export class SecondModule {

    //noinspection JSUnusedGlobalSymbols
    @Provides("another number")
    public static provideAnotherNumber(): number {
        return 5;
    }
}