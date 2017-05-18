import {Module} from "../../../src/public/di/decorators/class.module.decorator";
import {Provides} from "../../../src/public/di/decorators/method.provides.decorator";
import {Sugar} from "../models/components/sugar";
import {Water} from "../models/components/water";
import {WaterType} from "../models/components/water-type";
import {GasHeater} from "../models/heaters/gas.heater";
import {Heater} from "../models/heaters/heater";
import {AmericanoMixer} from "../models/mixers/americano.mixer";
import {CappuccinoMixer} from "../models/mixers/cappuccino.mixer";
import {DefaultMixer} from "../models/mixers/default.cappuccino.mixer";
import {Mixer} from "../models/mixers/mixer";
import {Pump} from "../models/pumps/pump";
import {Siphon} from "../models/pumps/siphon.pump";
import {AmericanoScope} from "../scopes/americano.scope";
import {CappuccinoScope} from "../scopes/cappuccino.scope";
import {ElectricHeater} from "../models/heaters/electric.heater";
import {Thermosiphon} from "../models/pumps/thermosiphon.pump";

@Module()
export class CoffeeMakerModule {

    //noinspection JSUnusedGlobalSymbols
    @Provides()
    public static provideSiphon(): Pump {
        return new Siphon();
    }

    //noinspection JSUnusedGlobalSymbols
    @Provides() @AmericanoScope()
    public static provideThermosiphon(): Pump {
        return new Thermosiphon();
    }

    //noinspection JSUnusedGlobalSymbols
    @Provides()
    public static provideGasHeater(): Heater {
        return new GasHeater();
    }

    //noinspection JSUnusedGlobalSymbols
    @Provides() @CappuccinoScope()
    public static provideElectricHeater(): Heater {
        return new ElectricHeater();
    }

    //noinspection JSUnusedGlobalSymbols
    @Provides()
    public static provideWater(): Water {
        return new Water(WaterType.COLD, 5);
    }

    //noinspection JSUnusedGlobalSymbols
    @Provides()
    public static provideSugar(): Sugar {
        return new Sugar(100);
    }

    //noinspection JSUnusedGlobalSymbols
    @Provides()
    @CappuccinoScope()
    public static provideCappuccinoMixer(): Mixer {
        return new CappuccinoMixer();
    }

    //noinspection JSUnusedGlobalSymbols
    @Provides()
    @AmericanoScope()
    public static provideAmericanoMixer(): Mixer {
        return new AmericanoMixer();
    }

    //noinspection JSUnusedGlobalSymbols
    @Provides()
    public static provideDefaultMixer(): Mixer {
        return new DefaultMixer();
    }

    //noinspection JSUnusedLocalSymbols
    private constructor() {

    }
}