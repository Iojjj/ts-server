import {Component} from "../../../../src/public/di/decorators/class.component.decorator";
import {Inject} from "../../../../src/public/di/decorators/prop.inject.decorator";
import {Provider} from "../../../../src/public/di/models/abs.provider";
import {CoffeeModule} from "../../modules/coffee.module";
import {Coffee} from "../components/coffee";
import {Mixer} from "./mixer";

@Component(CoffeeModule)
export class DefaultMixer extends Mixer {

    @Inject("coffee")
    private readonly coffeeProvider: Provider<Coffee>;

    protected brewCoffee(): Coffee {
        return this.coffeeProvider.get();
    }

}