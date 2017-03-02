import {Siphon, Thermosiphon} from "./pump";
import {Heater, ElectricHeater, GasHeater} from "./heater";
import {Module} from "../../framework/src/dependency-injection/decorators/module/module.decorator";
import {Provides} from "../../framework/src/dependency-injection/decorators/module/provides.decorator";
import {Singleton} from "../../framework/src/dependency-injection/decorators/module/singleton.decorator";

@Module()
export class DripCoffeeModule {

    //noinspection JSUnusedGlobalSymbols
    @Provides("gas heater")
    public static provideGasHeater(): Heater {
        return new GasHeater();
    }

    //noinspection JSUnusedGlobalSymbols
    @Provides()
    public static provideElectricHeater(): ElectricHeater {
        return new ElectricHeater();
    }

    //noinspection JSUnusedGlobalSymbols
    @Provides("siphon")
    public static provideSiphon(): Siphon {
        return new Siphon();
    }

    //noinspection JSUnusedGlobalSymbols
    @Provides()
    @Singleton()
    public static provideThermosiphon(): Thermosiphon {
        return new Thermosiphon();
    }

    //noinspection JSUnusedGlobalSymbols
    @Provides("number")
    public static provideNumber(): number {
        return 5;
    }

    //noinspection JSUnusedGlobalSymbols
    @Provides()
    @Singleton()
    public static provideDate(): Date {
        return new Date();
    }

    //noinspection JSUnusedGlobalSymbols
    @Provides("now")
    public static provideNow(): Date {
        return new Date();
    }

    @Provides()
    public static provideString(): string {
        return "string";
    }

    @Provides()
    public static provideSymbol(): symbol {
        return Symbol.for("string");
    }

    @Provides()
    public static provideBoolean(): boolean {
        return true;
    }

    @Provides()
    public static provideArray(): GasHeater[] {
        return [new GasHeater(), new GasHeater()];
    }
}