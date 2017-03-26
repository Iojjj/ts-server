import {Coffee} from "../components/coffee";
import {Mixer} from "./mixer";
import {CappuccinoScope} from "../../scopes/cappuccino.scope";
import {Provider} from "../../../../src/di/models/abs.provider";
import {Inject} from "../../../../src/di/decorators/prop.inject.decorator";
import {Component} from "../../../../src/di/decorators/class.component.decorator";
import {CoffeeModule} from "../../modules/coffee.module";

@CappuccinoScope()
@Component(CoffeeModule)
export class CappuccinoMixer extends Mixer {

    @Inject("coffee")
    private readonly coffeeProvider: Provider<Coffee>;

    protected brewCoffee(): Coffee {
        return this.coffeeProvider.get();
    }

}