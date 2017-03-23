import {C4, C2} from "./inheritence";
import {Provides} from "../../src/di/decorators/method.provides.decorator";
import {Module} from "../../src/di/decorators/class.module.decorator";

@Module()
export class M4 {

    private static COUNTER = 1;

    @Provides()
    public static provideC4(): C4 {
        return new C4();
    }

    @Provides()
    public static provideC2(): C2 {
        return new C2(M4.COUNTER++);
    }
}