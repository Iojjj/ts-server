import {Logger} from "../../src/common/loggers/abs.logger";
import {Component} from "../../src/di/decorators/class.component.decorator";
import {Inject} from "../../src/di/decorators/prop.inject.decorator";
import {Next} from "../../src/server-express/decorators/next.decorator";
import {Req} from "../../src/server-express/decorators/request.decorator";
import {Res} from "../../src/server-express/decorators/response.decorator";
import {Result} from "../../src/server-express/decorators/result.decorator";
import {CoreSharedModule} from "../../src/server/core/internal/modules/shared.module";
import {SimpleMiddleware} from "../../src/server/core/models/base/abs.middleware";
import {Middleware} from "../../src/server/decorators/middleware.decorator";
import e = require("express");

@Middleware()
@Component(CoreSharedModule)
export class LoggingMiddleware extends SimpleMiddleware {

    @Inject()
    private logger: Logger;

    protected async run(@Next() next: () => Promise<any>,
                        @Req() req: e.Request,
                        @Res() res: e.Response,
                        @Result() result: () => any): Promise<any> {
        const startDate = new Date();
        await next();
        const endDate = new Date();
        const diff = (endDate.getTime() - startDate.getTime());
        const arr = [];
        for (let i = 0; i < 100; i++) {
            arr.push("\u2550");
        }
        const line = arr.join("");
        this.logger.d(`\u2554${line}`);
        this.logger.d("\u2551\tREQUEST");
        this.logger.d("\u2551\t\t", req.method, req.originalUrl);
        this.printArray(req.headers, "HEADERS");
        this.printArray(req.params, "PARAMS");
        this.printArray(req.query, "QUERY");
        if (!!req.body) {
            this.printObject(req.body, "BODY");
        }
        this.logger.d("\u2551\tRESPONSE");
        this.logger.d("\u2551\t\t", res.statusCode, res.statusMessage, diff, "ms");
        const resValue = result();
        if (!!resValue) {
            this.printObject(resValue);
        }

        this.logger.d(`\u255A${line}`);
    }

    private printArray(object: any, title: string): void {
        const lines = Object.keys(object)
            .map(key => `${key}: ${object[key]}`);
        if (lines.length > 0) {
            this.logger.d(`\u2551\t${title}`);
            lines.forEach(line => this.logger.d("\u2551\t\t", line));
        }
    }

    private printObject(object: any, title?: string): void {
        if (!!title) {
            this.logger.d(`\u2551\t${title}`);
        }
        const lines = JSON.stringify(object, undefined, 4).split("\n");
        lines.forEach(line => this.logger.d("\u2551\t\t", line));
    }
}