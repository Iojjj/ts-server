import {ResponseHandlerMiddleware} from "../../../decorators/response-handler-middleware.decorator";
import {HttpError} from "../../errors/http-error";
import {SimpleMiddleware} from "../../models/base/abs.middleware";
import {ResponseType} from "../../models/types/response-type";

/**
 * @internal
 */
@ResponseHandlerMiddleware(ResponseType.ANY)
export class DefaultResponseHandlerMiddleware extends SimpleMiddleware {
    protected run(): Promise<any> | any {
        return Promise.reject(HttpError.newError(500, "Response handler is not defined."));
    }
}