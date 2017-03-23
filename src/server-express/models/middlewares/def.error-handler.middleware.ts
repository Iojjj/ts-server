import e = require("express");
import {SimpleMiddleware} from "../../../server/core/models/base/abs.middleware";
import {ErrorHandlerMiddleware} from "../../../server/decorators/error-handler-middleware.decorator";
import {Error} from "../../decorators/error.decorator";
import {Res} from "../../decorators/response.decorator";

@ErrorHandlerMiddleware()
export class DefaultErrorHandlerMiddleware extends SimpleMiddleware {

    protected run(@Error() error: Error, @Res() res: e.Response): Promise<any> {
        console.log(error.stack);
        const response = {
            message: error.message,
            stack: error.stack ? error.stack.split("\n") : undefined,
        };
        if (res.headersSent) {
            return Promise.reject(error);
        }
        let statusCode = 500;
        if (error.hasOwnProperty("statusCode")) {
            statusCode = (error as any)["statusCode"];
        }
        res.status(statusCode).json(response);
        return Promise.resolve();
    }
}