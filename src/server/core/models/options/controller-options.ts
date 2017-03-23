import {Route} from "../types/route.type";

/**
 * Options of controller.
 */
export interface ControllerOptions {

    /**
     * Version of controller, that will be used in route. Complete route of any controllers' methods would be:
     * <code>scheme://hostname:port/route-prefix/controller-version/controller-route/method-route</code>.
     */
    readonly version?: string;

    /**
     * Route of controller. Complete route of controller would be:
     * <code>scheme://hostname:port/route-prefix/controller-version/controller-route/method-route</code>.
     */
    readonly route?: Route;
}