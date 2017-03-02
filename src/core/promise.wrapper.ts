import {MiddlewareType} from "./server.types";
export class PromiseWrapper {

    private constructor() {

    }

    public static wrapObject<T>(object: T): Promise<T> {
        return Promise.resolve<T>(object);
    }

    public static wrapFunction<T>(fn: () => T): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            try {
                const res = fn();
                resolve(res);
            } catch (error) {
                reject(error);
            }
        });
    }

    public static promiseToMiddleware(promise: (req: any, res: any) => Promise<any>): MiddlewareType {
        return (req: any, res: any, next?: (err?: any) => any): void => {
            promise(req, res)
                .then(() => !!next && next())
                .catch((error) => !!next && next(error));
        };
    }

    public static middlewareToPromise<T>(middleware: MiddlewareType): (req: any, res: any) => Promise<any> {
        return (req: any, res: any): Promise<any> => {
            return new Promise<T>((resolve, reject) => {
                try {
                    middleware(req, res, (err?: any) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve();
                    });
                } catch (error) {
                    reject(error);
                }
            });
        };
    }
}