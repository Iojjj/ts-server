import {Logger} from "../../../../src/public/common/loggers/abs.logger";
import {Component} from "../../../../src/public/di/decorators/class.component.decorator";
import {Inject} from "../../../../src/public/di/decorators/prop.inject.decorator";
import {UtilsModule} from "../../modules/utils.module";
import {PumpScope} from "../../scopes/pump.scope";
import {PromiseUtils} from "../../utils/promise.utils";
import {Coffee} from "../components/coffee";
import {Cup} from "../cup";
import {Pump} from "./pump";

@PumpScope()
@Component(UtilsModule)
export class Siphon extends Pump {

    @Inject("siphon")
    private logger: Logger;

    @Inject()
    private promiseUtils: PromiseUtils;

    public async pumpCoffee(coffee: Coffee): Promise<Cup> {
        this.logger.i("<= <= <= pumping coffee <= <= <=");
        await this.promiseUtils.wait(400);
        return new Cup(coffee);
    }

}