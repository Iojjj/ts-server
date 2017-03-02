import {Heater, ElectricHeater, GasHeater} from "./heater";
import {Thermosiphon, Siphon} from "./pump";
import {DripCoffeeModule} from "./drip-coffee.module";
import {Component} from "../../framework/src/dependency-injection/decorators/component/component.decorator";
import {Inject} from "../../framework/src/dependency-injection/decorators/inject/inject.decorator";
import {Named} from "../../framework/src/dependency-injection/decorators/inject/named.decorator";
import {Lazy} from "../../framework/src/dependency-injection/decorators/inject/lazy.decorator";

@Component(DripCoffeeModule)
export class CoffeeMaker {

    @Inject() @Named("gas heater")
    public heater: Heater = new ElectricHeater();

    @Inject() @Lazy() @Named(Thermosiphon)
    public pump: Siphon;

    public brew(): void {
        this.heater.on();
        this.pump.pump();
        console.log(" [_]P coffee! [_]P");
    }

    public brew2(@Inject() heater: ElectricHeater,
                 @Inject() pump: Thermosiphon) {
        this.heater = heater;
        this.pump = pump;
        this.brew();
    }

    public brew3(@Inject() n: number,
                 @Inject() s: string,
                 @Inject() b: boolean,
                 @Inject() l: Date,
                 @Inject() sym: symbol,
                 @Inject() arr: GasHeater[]) {
        console.log(n);
        console.log(s);
        console.log(b);
        console.log(l);
        console.log(sym);
        console.log(arr);
    }
}