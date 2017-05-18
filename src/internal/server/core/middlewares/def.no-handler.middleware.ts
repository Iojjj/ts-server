import {ResponseHandlerMiddleware} from "../../../../public/server/decorators/response-handler-middleware.decorator";
import {HttpError} from "../../../../public/server/core/errors/http-error";
import {SimpleMiddleware} from "../../../../public/server/core/models/base/abs.middleware";
import {ResponseType} from "../../../../public/server/core/models/types/response-type";

/**
 * @internal
 */
@ResponseHandlerMiddleware(ResponseType.ANY)
export class DefaultResponseHandlerMiddleware extends SimpleMiddleware {
    protected run(): Promise<any> | any {
        return Promise.reject(HttpError.newError(500, "Response handler is not defined."));
    }
}