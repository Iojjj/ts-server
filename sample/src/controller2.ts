import * as express from "express";
import {Controller} from "../../packages/core/src/decorators/controller.decorator";
import {Path, Res} from "../../packages/core/src/decorators/param.decorator";
import {Logger} from "../../packages/core/src/utils/logger";
import {HttpGet} from "../../packages/core/src/decorators/http-method.decorators";

@Controller("/users")
export default class ControllerImpl {

    @HttpGet("/:id/:cat")
    public getById(@Path("cat") param: number, @Res() res: express.Response): void {
        Logger.console().d(param);
        res.status(200).send(param + "");
    }
}