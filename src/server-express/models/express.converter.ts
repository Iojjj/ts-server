import e = require("express");
import {SimpleMiddleware} from "../../server/core/models/base/abs.middleware";

export class ExpressConverter {

    public fromDriverMiddleware(middleware: SimpleMiddleware, callNext = true): e.RequestHandler {
        return async (req: e.Request, res: e.Response, next: e.NextFunction) => {
            try {
                await middleware.execute(req, res, next);
                if (callNext) {
                    next();
                }
            } catch (error) {
                next(error);
            }
        };
    }

    public fromDriverErrorMiddleware(middleware: SimpleMiddleware): e.ErrorRequestHandler {
        return async (error: Error, req: e.Request, res: e.Response, next: e.NextFunction) => {
            try {
                await middleware.execute(req, res, next, error);
                //next();
            } catch (error) {
                next(error);
            }
        };
    }
}