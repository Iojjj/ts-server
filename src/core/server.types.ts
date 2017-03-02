/**
 * Route path type.
 */
export type RouteType = string | RegExp | (string | RegExp)[];

/**
 * Trust proxy callback type.
 */
export type TrustProxyCallback = () => boolean;

/**
 * Response type.
 */
export type ResponseType = "raw" | "json" | "jsonp";

export type MiddlewareType = ((req: any, res: any, next?: (err?: any) => any) => any);

export interface MiddlewareInterface {
    use(req: any, res: any, next?: (err?: any) => any): any;
}