import {Module} from "../../framework/src/dependency-injection/decorators/module/module.decorator";
import {Provides} from "../../framework/src/dependency-injection/decorators/module/provides.decorator";
import {TypeTransformer} from "../../framework/src/type-transformer/type.transformer";
import {Singleton} from "../../framework/src/dependency-injection/decorators/module/singleton.decorator";

@Module()
export class TestModule {

    //noinspection JSUnusedGlobalSymbols
    @Provides()
    @Singleton()
    public static provideTypeTransformer(): TypeTransformer {
        return new TypeTransformer();
    }
}