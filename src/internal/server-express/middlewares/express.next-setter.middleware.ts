import e = require("express");
import {SimpleMiddleware} from "../../../public/server/core/models/base/abs.middleware";
import {Middleware} from "../../../public/server/decorators/middleware.decorator";
import {Req} from "../../../public/server-express/decorators/request.decorator";

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