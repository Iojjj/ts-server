import {Controller} from "../../core/src/decorators/controller.decorator";
import {HttpGet} from "../../core/src/decorators/http-method.decorators";
import {Path, Res} from "../../core/src/decorators/param.decorator";

@Controller("/users")
export default class ControllerImpl {

    @HttpGet("/:id/:cat")
    public getById(@Path("cat") param: number, @Res() res: any): void {
        console.log(param);
        res.status(200).send(param);
    }
}