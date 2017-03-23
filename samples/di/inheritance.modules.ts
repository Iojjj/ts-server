import {Module} from "../../src/di/decorators/class.module.decorator";
import {Provides} from "../../src/di/decorators/method.provides.decorator";

@Module()
export class M1 {

    @Provides("s1")
    public static provideS1(): string {
        return "s1_injected";
    }
}

@Module()
export class M2 {

    @Provides("s2")
    public static provideS2(): string {
        return "s2_injected";
    }
}

@Module()
export class M3 {

    @Provides("s3")
    public static provideS3(): string {
        return "s3_injected";
    }

    @Provides("s2")
    public static provideS2(): string {
        return "s2_injected_from_m3";
    }
}