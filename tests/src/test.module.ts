import {Module} from "../../src/di/decorators/module/module.decorator";
import {Provides} from "../../src/di/decorators/module/provides.decorator";
import {TypeTransformer} from "../../src/type-transformer/type.transformer";
import {Singleton} from "../../src/di/decorators/module/singleton.decorator";

@Module()
export class TestModule {

    //noinspection JSUnusedGlobalSymbols
    @Provides()
    @Singleton()
    public static provideTypeTransformer(): TypeTransformer {
        return new TypeTransformer();
    }
}