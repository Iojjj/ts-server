import {Logger} from "../../../../src/public/common/loggers/abs.logger";
import {Component} from "../../../../src/public/di/decorators/class.component.decorator";
import {Inject} from "../../../../src/public/di/decorators/prop.inject.decorator";
import {UtilsModule} from "../../modules/utils.module";
import {HeaterScope} from "../../scopes/heater.scope";
import {PromiseUtils} from "../../utils/promise.utils";
import {Water} from "../components/water";
import {Heater} from "./heater";

@HeaterScope()
@Component(UtilsModule)
export class ElectricHeater implements Heater {

    @Inject()
    private promiseUtils: PromiseUtils;

    @Inject("el-heater")
    private logger: Logger;

    public on(water: Water): Promise<Water> {
        this.logger.i("~~~ heater turned on ~~~");
        if (water.heatRequired()) {
            this.logger.i("~~~ heating water ~~~");
            return this.promiseUtils.wait(500)
                .then(() => {
                    water.makeHot();
                    return water;
                });
        }
        return Promise.resolve(water);
    }

    public off(): Promise<void> {
        this.logger.i("~~~ heater turned off ~~~");
        return new Promise<void>(resolve => {
            setTimeout(resolve, 500);
        });
    }

}