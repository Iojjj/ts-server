import * as express from "express";
import {Controller} from "../../packages/core/src/decorators/controller.decorator";
import {JsonResponse} from "../../packages/core/src/decorators/response.decorator";
import {AuthorizationRequired} from "../../packages/core/src/decorators/authorized.decorator";
import {Render} from "../../packages/core/src/decorators/render.decorator";
import {Path, Req, Res} from "../../packages/core/src/decorators/param.decorator";
import {Required} from "../../packages/core/src/decorators/required.decorator";
import {HttpGet, HttpPost} from "../../packages/core/src/decorators/http-method.decorators";
import {Logger} from "../../packages/core/src/utils/logger";

@Controller("/users")
export default class ControllerImpl {

    @JsonResponse()
    @AuthorizationRequired()
    @HttpGet("/:id/:cat")
    @HttpPost("/:id/:cat")
    @Render("template.html")
    public getById(@Path("id") param: Record<string, string>,
                   @Required() @Req()req: express.Request, @Res() res: express.Response): void {
        Logger.console().d(param);
        res.status(400).send(param);
    }
}