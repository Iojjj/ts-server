import {RawController} from "../../src/public/server/decorators/raw-controller.decorator";
import {Controller1} from "./controller1";
import {Get} from "../../src/public/server/decorators/get.decorator";

@RawController({
    route: "/cats",
    version: "*"
})
export class Controller2 extends Controller1 {

    @Get()
    public async getById(): Promise<any> {

    }
}