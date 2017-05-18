import {Component} from "../../../../src/public/di/decorators/class.component.decorator";
import {Inject} from "../../../../src/public/di/decorators/prop.inject.decorator";
import {CoffeeMakerModule} from "../../modules/coffee-maker.module";
import {Sugar} from "../components/sugar";
import {Water} from "../components/water";
import {Cup} from "../cup";
import {Heater} from "../heaters/heater";
import {Mixer} from "../mixers/mixer";
import {Pump} from "../pumps/pump";

@Component(CoffeeMakerModule)
export abstract class CoffeeMaker {

    @Inject()
    private readonly heater: Heater;

    @Inject()
    private readonly pump: Pump;

    @Inject()
    private readonly water: Water;

    @Inject()
    private readonly sugar: Sugar;

    @Inject()
    private readonly mixer: Mixer;

    public async brew(): Promise<Cup> {
        await this.heater.on(this.water);
        const coffee = await this.mixer.mix(this.water, this.sugar);
        const cup = await this.pump.pumpCoffee(coffee);
        await this.heater.off();
        this.water.makeCold();
        return cup;
    }
}