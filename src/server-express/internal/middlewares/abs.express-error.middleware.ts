import e = require("express");
import {SimpleMiddleware} from "../../../server/core/models/base/abs.middleware";

/**
 * @internal
 */
export abstract class ExpressErrorMiddleware extends SimpleMiddleware {

    protected abstract run(req: e.Request, res: e.Response, next: e.NextFunction, error: any): Promise<any> | any;
}