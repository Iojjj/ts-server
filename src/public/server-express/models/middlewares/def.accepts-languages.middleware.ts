import e = require("express");
import {ErrorStatusCodes} from "../../../server/core/status-codes/error.status-codes";
import {HttpError} from "../../../server/core/errors/http-error";
import {AcceptsMiddleware} from "../../../server/core/models/base/abs.accepts.middleware";
import {Middleware} from "../../../server/decorators/middleware.decorator";
import {Req} from "../../decorators/request.decorator";

@Middleware()
export class DefaultAcceptsLanguagesMiddleware extends AcceptsMiddleware {

    protected run(@Req() req: e.Request): Promise<any> | any {
        const accepts = req.acceptsLanguages(this.values);
        if (accepts === false) {
            const error = HttpError.newError(ErrorStatusCodes.NOT_ACCEPTABLE, `Client must accept such languages: `
                + `${this.values.join(", ")}.`);
            return Promise.reject(error);
        }
    }

}