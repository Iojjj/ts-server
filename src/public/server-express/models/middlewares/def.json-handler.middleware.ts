import e = require("express");
import {SimpleMiddleware} from "../../../server/core/models/base/abs.middleware";
import {ResponseType} from "../../../server/core/models/types/response-type";
import {ResponseHandlerMiddleware} from "../../../server/decorators/response-handler-middleware.decorator";
import {Res} from "../../decorators/response.decorator";
import {Result} from "../../decorators/result.decorator";

@ResponseHandlerMiddleware(ResponseType.JSON)
export class DefaultJsonHandlerMiddleware extends SimpleMiddleware {

    protected run(@Res() res: e.Response, @Result() result: () => any): any {
        if (res.headersSent) {
            return;
        }
        const resValue = result();
        if (!!resValue) {
            res.status(200).json(resValue).end();
        } else {
            res.sendStatus(404);
        }
    }

}