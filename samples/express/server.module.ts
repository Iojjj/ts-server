import {Controller1} from "./controller1";
import {Module} from "../../src/di/decorators/class.module.decorator";
import {Provides} from "../../src/di/decorators/method.provides.decorator";
import {Controller2} from "./controller2";

@Module()
export class ServerModule {

    //noinspection JSUnusedGlobalSymbols
    @Provides("controllers")
    public static provideControllers(): any[] {
        return [new Controller1(), new Controller2()];
    }
}