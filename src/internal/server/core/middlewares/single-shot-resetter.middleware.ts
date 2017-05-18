import {SimpleMiddleware} from "../../../../public/server/core/models/base/abs.middleware";
import {SingleShotMiddleware} from "./single-shot.middleware";

/**
 * @internal
 */
export class SingleShotResetterMiddleware extends SimpleMiddleware {

    private middleware: SimpleMiddleware;
    private singleShots: SingleShotMiddleware[];

    constructor(middleware: SimpleMiddleware, singleShots: SingleShotMiddleware[]) {
        super();
        this.middleware = middleware;
        this.singleShots = singleShots;
    }

    protected run(...args: any[]): Promise<any> | any {
        return this.middleware.execute(...args)
            .then(() => this.singleShots.forEach(s => s.reset()))
            .catch((error: any) => {
                this.singleShots.forEach(s => s.reset());
                return Promise.reject(error);
            });
    }
}