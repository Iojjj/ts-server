import {Component} from "../../../../src/di/decorators/class.component.decorator";
import {Inject} from "../../../../src/di/decorators/prop.inject.decorator";
import {UtilsModule} from "../../modules/utils.module";
import {PromiseUtils} from "../../utils/promise.utils";
import {Coffee} from "../components/coffee";
import {Sugar} from "../components/sugar";
import {Water} from "../components/water";

@Component(UtilsModule)
export abstract class Mixer {

    @Inject()
    private promiseUtils: PromiseUtils;

    public async mix(water: Water, sugar: Sugar): Promise<Coffee> {
        if (water.heatRequired()) {
            throw new Error("Hot water required.");
        }
        water.consume(0.3);
        sugar.consume(18);
        await this.promiseUtils.wait(300);
        return this.brewCoffee();
    }

    protected abstract brewCoffee(): Coffee;
}