import {Heater, ElectricHeater} from "./heater";
import {Thermosiphon} from "./pump";
import {DripCoffeeModule} from "./drip-coffee.module";
import {Component} from "../../src/di/decorators/class.component.decorator";
import {Inject} from "../../src/di/decorators/prop.inject.decorator";
import {Named} from "../../src/di/decorators/prop.named.decorator";
import {Lazy} from "../../src/di/decorators/prop.lazy.decorator";

@Component(DripCoffeeModule)
export class CoffeeMaker {

    @Inject() @Named("gas heater")
    public heater: Heater = new ElectricHeater();

    @Inject() @Lazy()
    public pump: Thermosiphon;

    public brew(): void {
        this.heater.on();
        this.pump.pump();
        console.log(" [_]P coffee! [_]P");
    }
}