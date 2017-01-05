import {Driver} from "./server.driver";

/**
 * Route path type.
 */
export type RouteType = string | RegExp | (string | RegExp)[];

/**
 * HTTP method type.
 */
export type HttpMethodName =
    "checkout" |
        "copy" |
        "delete" |
        "get" |
        "head" |
        "lock" |
        "merge" |
        "mkactivity" |
        "mkcol" |
        "move" |
        "m-search" |
        "notify" |
        "options" |
        "patch" |
        "post" |
        "purge" |
        "put" |
        "report" |
        "search" |
        "subscribe" |
        "trace" |
        "unlock" |
        "unsubscribe";

/**
 * Injectable parameter type.
 */
export type ParamType = "body" | "query" | "header" | "headers" | "file" | "files" | "param"
    | "session" | "cookie" | "cookies" | "req" | "res" | "next";

/**
 * Trust proxy callback type.
 */
export type TrustProxyCallback = () => boolean;

/**
 * Response type.
 */
export type ResponseType = "raw" | "json" | "jsonp";

/**
 * Driver middleware type.
 */
export type DriverMiddleware = (req: any, res: any, next: any, driver: Driver<any, any>) => (void|PromiseLike<void>);
