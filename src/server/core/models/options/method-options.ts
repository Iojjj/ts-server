import {ResponseType} from "../types/response-type";
import {Route} from "../types/route.type";

/**
 * Options of controller's method.
 */
export interface MethodOptions {

    /**
     * Route of controller. Complete route of any controllers' methods would be:
     * <code>scheme://hostname:port/route-prefix/controller-version/controller-route/method-route</code>.
     */
    readonly route?: Route;

    readonly responseType?: ResponseType;
}