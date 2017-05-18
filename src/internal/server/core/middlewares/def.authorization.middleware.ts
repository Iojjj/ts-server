import {AuthorizationHandlerMiddleware} from "../../../../public/server/decorators/authorization-middleware.decorator";
import {ErrorStatusCodes} from "../../../../public/server/core/status-codes/error.status-codes";
import {HttpError} from "../../../../public/server/core/errors/http-error";
import {SimpleMiddleware} from "../../../../public/server/core/models/base/abs.middleware";

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