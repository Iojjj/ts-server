import e = require("express");
import {Next} from "../../src/public/server-express/decorators/next.decorator";
import {Param} from "../../src/public/server-express/decorators/param.decorator";
import {Query} from "../../src/public/server-express/decorators/query.decorator";
import {Req} from "../../src/public/server-express/decorators/request.decorator";
import {Res} from "../../src/public/server-express/decorators/response.decorator";
import {JsonController} from "../../src/public/server/decorators/json-controller.decorator";
import {AcceptsLanguages} from "../../src/public/server/decorators/accepts-languages.decorator";
import {Get} from "../../src/public/server/decorators/get.decorator";

@JsonController({
    route: "users",
    version: "v1",
})
export class Controller1 {

    @AcceptsLanguages("ru")
    //noinspection JSMethodCanBeStatic
    @Get(/([0-9]+)\/p$/)
    public async getById(@Req() req: e.Request,
                         @Res() res: e.Response,
                         @Param("0") id: number,
                         @Query("param") query: string,
                         @Next() next: () => Promise<any>): Promise<any> {
        console.log("METHOD");
        return {
            result: "some result",
        };
    }
}