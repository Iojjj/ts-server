import {AuthorizationHandlerMiddleware} from "../../../decorators/authorization-middleware.decorator";
import {ErrorStatusCodes} from "../../status-codes/error.status-codes";
import {HttpError} from "../../errors/http-error";
import {SimpleMiddleware} from "../../models/base/abs.middleware";

/**
 * @internal
 */
@AuthorizationHandlerMiddleware()
export class DefaultAuthorizationMiddleware extends SimpleMiddleware {

    protected run(): Promise<any> {
        const error = HttpError.newError(ErrorStatusCodes.UNAUTHORIZED,
            "You must implement your own authorization handler middleware.");
        return Promise.reject(error);
    }
}