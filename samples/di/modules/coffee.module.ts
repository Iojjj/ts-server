import {Provides} from "../../../src/public/di/decorators/method.provides.decorator";
import {Coffee} from "../models/components/coffee";
import {AmericanoScope} from "../scopes/americano.scope";
import {CappuccinoScope} from "../scopes/cappuccino.scope";
import {Module} from "../../../src/public/di/decorators/class.module.decorator";

@Module()
export class CoffeeModule {

    //noinspection JSUnusedGlobalSymbols
    @CappuccinoScope()
    @Provides("coffee")
    public static provideCappuccino(): Coffee {
        return new Coffee("cappuccino");
    }

    //noinspection JSUnusedGlobalSymbols
    @AmericanoScope()
    @Provides("coffee")
    public static provideAmericano(): Coffee {
        return new Coffee("americano");
    }

    //noinspection JSUnusedGlobalSymbols
    @Provides("coffee")
    public static provideDefaultCoffee(): Coffee {
        return new Coffee("default");
    }

    //noinspection JSUnusedLocalSymbols
    private constructor() {

    }
}