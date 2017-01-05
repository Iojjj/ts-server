import {TrustProxyCallback} from "../server.types";
import {DecoratorFactory} from "./decorator.factory";

/**
 * Decorator that marks class as a HTTP server.
 * @param options various configuration options
 * @return {(target:any)=>void}
 */
export function Server(options?: ServerDecoratorOptions) {
    return function (target: any) {
        DecoratorFactory.newServerDecoratorService().define(target, options || {});
    }
}

/**
 * Various configuration options for server.
 */
export interface ServerDecoratorOptions {

    /**
     * List of view engines.
     */
    readonly viewEngine?: Record<string, Function>;

    /**
     * List of paths to directories where views' layouts stored.
     */
    readonly views?: string | string[];

    /**
     * Flag indicates that views must be cached. It's set to <code>true</code> for <code>production</code> environment.
     */
    readonly viewCache?: boolean;

    /**
     * Flag indicates that routing must be case sensitive. Default value is <code>undefined</code>.
     */
    readonly caseSensitiveRouting?: boolean | undefined;

    /**
     * Configuration for proxies. For more details see
     * {@link http://expressjs.com/en/guide/behind-proxies.html|Express behind proxies}.
     */
    readonly trustProxy?: boolean | string[] | number | TrustProxyCallback;

    /**
     * Route prefix for all controllers. For example, <code>/api</code>.
     */
    readonly routePrefix?: string;

    /**
     * List of controllers grouped by version. For example:
     * <code>
     *     v1: ["path/to/v1/controllers/*.js"],
     *     v2: ["path/to/v2/controllers/*.js"]
     * </code>
     */
    readonly controllers?: Record<string, string[]>[];
}