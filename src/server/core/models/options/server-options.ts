/**
 * Options of server.
 */
export interface ServerOptions {

    /**
     * Route prefix for controllers. For example, "/api". Complete route of any controllers' methods would be:
     * <code>scheme://hostname:port/route-prefix/controller-version/controller-route/method-route</code>.
     */
    readonly routePrefix?: string;

    readonly hostname?: string;

    readonly port?: number;
}