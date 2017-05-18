import e = require("express");
import {SimpleMiddleware} from "../../../public/server/core/models/base/abs.middleware";

/**
 * @internal
 */
export abstract class ExpressMiddleware extends SimpleMiddleware {

    protected abstract run(req: e.Request, res: e.Response, next: e.NextFunction): Promise<any> | any;
}