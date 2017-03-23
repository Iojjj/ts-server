import {SimpleMiddleware} from "../../models/base/abs.middleware";

/**
 * @internal
 */
export class SingleShotMiddleware extends SimpleMiddleware {

    private readonly _middleware: SimpleMiddleware;
    private _alreadyCalled: boolean;
    private _result: any;

    constructor(middleware: SimpleMiddleware) {
        super();
        this._middleware = middleware;
        this._alreadyCalled = false;
    }

    protected async run(...args: any[]): Promise<any> {
        if (!this._alreadyCalled) {
            this._result = await this._middleware.execute(...args);
            this._alreadyCalled = true;
        }
        return this._result;
    }

    public reset(): void {
        this._alreadyCalled = false;
        this._result = undefined;
    }
}