import {SimpleMiddleware} from "./abs.middleware";

export class CompositeMiddleware extends SimpleMiddleware {

    private middlewares: SimpleMiddleware[];

    public static of(firstMiddleware: SimpleMiddleware, ...other: SimpleMiddleware[]): CompositeMiddleware {
        return new CompositeMiddleware([firstMiddleware, ...other]);
    }

    public static from(middlewares: SimpleMiddleware[]): CompositeMiddleware {
        return new CompositeMiddleware(middlewares);
    }

    private constructor(middlewares: SimpleMiddleware[]) {
        super();
        this.middlewares = middlewares;
    }

    protected async run(req: any, res: any, ...args: any[]): Promise<any> {
        for (const m of this.middlewares) {
            try {
                await m.execute(req, res, ...args);
            } catch (error) {
                return Promise.reject(error);
            }
        }
    }
}