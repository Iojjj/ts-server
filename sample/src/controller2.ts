import {Controller} from "../../packages/core/src/decorators/controller.decorator";
import {HttpGet} from "../../packages/core/src/decorators/http-method.decorators";
import {Path, Res} from "../../packages/core/src/decorators/param.decorator";
import {Logger} from "../../packages/core/src/logger";

@Controller("/users")
export default class ControllerImpl {

    @HttpGet("/:id/:cat")
    public getById(@Path("cat") param: number, @Res() res: any): void {
        Logger.console().log(param);
        res.status(200).send(param);
    }
}