import {Controller} from "../../packages/core/src/decorators/controller.decorator";
import {HttpGet} from "../../packages/core/src/decorators/http-method.decorators";
import {Path, Req, Res} from "../../packages/core/src/decorators/param.decorator";

@Controller("/users")
export default class ControllerImpl {

    @HttpGet("/:id/:cat")
    public getById(@Path("id") param: number, @Req() req: string, @Res() res: any): void {
        console.log(param);
        res.status(400).send(param);
    }
}