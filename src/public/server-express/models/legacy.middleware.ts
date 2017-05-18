import e = require("express");
import {SimpleMiddleware} from "../../server/core/models/base/abs.middleware";
import {Middleware} from "../../server/decorators/middleware.decorator";
import {Req} from "../decorators/request.decorator";
import {Res} from "../decorators/response.decorator";

@Middleware()
export class LegacyMiddleware extends SimpleMiddleware {

    private readonly requestHandler: e.RequestHandler;

    public static from(requestHandler: e.RequestHandler): LegacyMiddleware {
        return new LegacyMiddleware(requestHandler);
    }

    private constructor(requestHandler: e.RequestHandler) {
        super();
        this.requestHandler = requestHandler;
    }

    protected run(@Req() req: e.Request, @Res() res: e.Response): Promise<any> {
        return new Promise<void>((resolve, reject) => {
            this.requestHandler(req, res, (err?: any) => {
                if (err) {
                    return reject(err);
                }
                return resolve();
            });
        });
    }

}