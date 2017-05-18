import e = require("express");
import {SimpleMiddleware} from "../../../public/server/core/models/base/abs.middleware";
import {ParameterExtractor} from "../../../public/server/core/models/types/parameter-extractor.type";

/**
 * @internal
 */
export class RequestExtractor extends ParameterExtractor {

    public extract(req: e.Request): e.Request {
        return req;
    }
}

/**
 * @internal
 */
export class ResponseExtractor extends ParameterExtractor {

    public extract(req: e.Request, res: e.Response): e.Response {
        return res;
    }
}

/**
 * @internal
 */
export class ResultExtractor extends ResponseExtractor {

    public extract(req: e.Request, res: e.Response): any {
        return () => {
            const state = (res as any).state;
            return state ? state.result : undefined;
        };
    }
}

/**
 * @internal
 */
export class ErrorExtractor extends ParameterExtractor {

    public extract(req: e.Request, res: e.Response, next: e.NextFunction, error?: any): any {
        return error;
    }
}

/**
 * @internal
 */
export class NextExtractor extends ParameterExtractor {

    public extract(req: e.Request, ...otherArgs: any[]): any {
        const anyReq = req as any;
        const next = anyReq.next as SimpleMiddleware | undefined;
        return () => {
            if (!next) {
                return Promise.resolve();
            }
            return next.execute(req, ...otherArgs);
        };
    }
}

/**
 * @internal
 */
export class BodyExtractor extends ParameterExtractor {

    public extract(req: e.Request): any {
        return req.body;
    }
}

/**
 * @internal
 */
export class ParamExtractor extends ParameterExtractor {

    private readonly paramName: string;

    constructor(paramName: string) {
        super();
        this.paramName = paramName;
    }

    public extract(req: e.Request): any {
        return req.params[this.paramName];
    }
}

/**
 * @internal
 */
export class QueryExtractor extends ParameterExtractor {

    private readonly paramName: string;

    constructor(paramName: string) {
        super();
        this.paramName = paramName;
    }

    public extract(req: e.Request): any {
        return req.query[this.paramName];
    }
}