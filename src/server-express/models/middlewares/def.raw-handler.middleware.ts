import e = require("express");
import {SimpleMiddleware} from "../../../server/core/models/base/abs.middleware";
import {ResponseType} from "../../../server/core/models/types/response-type";
import {ResponseHandlerMiddleware} from "../../../server/decorators/response-handler-middleware.decorator";
import {Req} from "../../decorators/request.decorator";
import {Res} from "../../decorators/response.decorator";
import {Result} from "../../decorators/result.decorator";

@ResponseHandlerMiddleware(ResponseType.RAW)
export class DefaultRawHandlerMiddleware extends SimpleMiddleware {

    protected run(@Req() req: e.Request, @Res() res: e.Response, @Result() result: () => any): any {
        if (res.headersSent) {
            return;
        }
        const resValue = result();
        if (!!resValue) {
            res.status(200).send(resValue).end();
        } else {
            res.sendStatus(404);
        }
    }

}