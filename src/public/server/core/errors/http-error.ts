import statuses = require("statuses");
import {ErrorStatusCodes} from "../status-codes/error.status-codes";

/**
 * Factory class that creates HTTP errors.
 */
export class HttpError {

    //noinspection JSUnusedLocalSymbols
    private constructor() {

    }

    /**
     * Create a new error related to HTTP.
     * @param code error code
     * @param message error message
     * @return {Error} newly created HTTP error
     */
    public static newError(code: ErrorStatusCodes, message?: string): Error {
        if (code < 400 || code > 500) {
            code = 500;
        }
        const name = statuses[code];
        const error = new Error(message || name);
        Object.defineProperty(error, "name", {
            enumerable: true,
            configurable: true,
            value: name,
        });
        Object.defineProperty(error, "statusCode", {
            enumerable: true,
            configurable: true,
            value: code,
        });
        return error;
    }
}