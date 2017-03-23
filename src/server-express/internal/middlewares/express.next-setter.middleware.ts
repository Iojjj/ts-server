import e = require("express");
import {SimpleMiddleware} from "../../../server/core/models/base/abs.middleware";
import {Middleware} from "../../../server/decorators/middleware.decorator";
import {Req} from "../../decorators/request.decorator";

/**
 * @internal
 */
@Middleware()
export class NextSetterMiddleware extends SimpleMiddleware {

    private readonly _next: SimpleMiddleware;

    constructor(next: SimpleMiddleware) {
        super();
        this._next = next;
    }

    protected run(@Req() req: e.Request): void {
        const anyReq = req as any;
        anyReq.next = this._next;
    }
}