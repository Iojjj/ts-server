import {Module} from "../../src/di/decorators/module/module.decorator";
import {Provides} from "../../src/di/decorators/module/provides.decorator";
import {Test} from "./test";
import {DateTransformTest} from "./date-transform.test";
import {BooleanTransformTest} from "./boolean-transform.test";
import {CustomClassTransformTest} from "./custom-class-transform.test";
import {NumberTransformTest} from "./number-transform.test";
import {StringTransformTest} from "./string-transform.test";

@Module()
export class MainTestModule {

    //noinspection JSUnusedGlobalSymbols
    @Provides("tests")
    public static provideTests(): Test[] {
        return [
            new BooleanTransformTest(),
            new NumberTransformTest(),
            new StringTransformTest(),
            new DateTransformTest(),
            new CustomClassTransformTest()
        ];
    }
}