import {MiddlewareType} from "../server.types";

/**
 * Implementation of composite middleware.
 */
export abstract class CompositeMiddleware {

    public use(request: any, response: any, next?: (err?: any) => any): any {
        CompositeMiddleware.reduce(this.produceMiddlewares(), request, response, next);
    }

    protected abstract produceMiddlewares(): MiddlewareType[];

    private static reduce(middlewares: MiddlewareType[],
                          request: any, response: any, next?: (err?: any) => any): void {
        let m = middlewares.shift();
        if (m) {
            m(request, response, (err: any) => {
                if (err) {
                    if (next) {
                        next(err);
                        return;
                    }
                }
                CompositeMiddleware.reduce(middlewares, request, response, next);
            });
            return;
        }
        if (next) {
            next();
        }
    }
}

export class SimpleCompositeMiddleware extends CompositeMiddleware {
    
    private _fn: () => MiddlewareType[];

    constructor(fn: () => MiddlewareType[]) {
        super();
        this._fn = fn;
    }

    protected produceMiddlewares(): MiddlewareType[] {
        return this._fn();
    }
}