import {Decorator} from "./decorator";

export function Server(options?: ServerDecoratorOptions): Function {
    return function (target: any) {
        Decorator.defineServer(target, options || {});
    }
}

export type ViewEngine = { [extension: string]: Function };
export type TrustProxyCallback = () => boolean;

export interface ServerDecoratorOptions {
    readonly viewEngine?: ViewEngine | ViewEngine[];
    readonly views?: string | string[];
    readonly viewCache?: boolean;
    readonly caseSensitiveRouting?: boolean | undefined;
    readonly trustProxy?: boolean | string[] | number | TrustProxyCallback;
    readonly routePrefix?: string;
    readonly controllers?: { [version: string]: string[] }[];
}