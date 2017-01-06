import {DriverMiddleware, MiddlewareType} from "../server.types";
import {Driver} from "../server.driver";
import {HttpMethodMetadata} from "./http-method.metadata";
import {ParamMetadata} from "./param.metadata";
import {SimpleCompositeMiddleware} from "./composite.middleware";
import {Logger} from "../utils/logger";
import {ClassTransformer} from "../utils/class.transformer";

export class HttpMethodWrapper implements DriverMiddleware {

    private _metadata: HttpMethodMetadata;
    private _injectParams: ParamMetadata[];
    private _originalMethod: Function;
    private _target: Object;
    private _driver: Driver<any, any> | undefined;
    private _classTransformer: ClassTransformer;

    public static newInstance(target: Object, originalMethod: Function,
                              metadata: HttpMethodMetadata, injectParams: ParamMetadata[]): DriverMiddleware {
        return new HttpMethodWrapper(target, originalMethod, metadata, injectParams);
    }

    private constructor(target: Object, originalMethod: Function,
                        metadata: HttpMethodMetadata, injectParams: ParamMetadata[]) {
        this._metadata = metadata;
        this._injectParams = injectParams;
        this._originalMethod = originalMethod;
        this._target = target;
        this._classTransformer = new ClassTransformer();
    }

    execute(req: any, res: any, next: any, driver: Driver<any, any>): void|PromiseLike<void> {
        const middleware = new SimpleCompositeMiddleware(() => {
            return [
                (req: any, res: any, next: (err?: any) => any): void => {
                    Logger.console().d("Driver");
                    this._driver = driver;
                    next();
                },
                this.newAuthMiddleware(),
                this.newOriginalMethodMiddleware(),
                (req: any, res: any, next: (err?: any) => any): void => {
                    Logger.console().d("Driver2");
                    this._driver = undefined;
                    next();
                }
            ];
        });
        middleware.use(req, res, next);
    }

    private newAuthMiddleware(): MiddlewareType {
        return (req: any, res: any, next: (err?: any) => any): void => {
            Logger.console().d("Auth");
            if (this._metadata.authorizationRequired) {
                next(new Error("Not Authorized"));
            } else {
                next();
            }
        };
    }

    private newOriginalMethodMiddleware(): MiddlewareType {
        return (req: any, res: any, next: (err?: any) => any): void => {
            Logger.console().d("Original");
            if (this._driver) {
                const args = this.getArguments(req, res, next, this._injectParams, this._driver);
                const result = this._originalMethod.apply(this._target, args);
                if (this._metadata.returnType instanceof Promise) {
                    (result as Promise<any>)
                        .then((res) => {

                        })
                } else {

                }
                next();
            } else {
                next(new Error("Driver not found."));
            }
        };
    }

    private getArguments<T, Rq>(req: any, res: any, next: any,
                                injectParams: ParamMetadata[], driver: Driver<T, Rq>): any[] {
        return injectParams
            .map(metadata => this.getArgument(req, res, next, metadata, driver))
            .reduce((all, single) => all.concat(single), []);
    }

    private getArgument<T, Rq>(req: Rq, res: any, next: any,
                               metadata: ParamMetadata, driver: Driver<T, Rq>): any {
        let arg: any;
        switch (metadata.injectType) {
            case "req": {
                arg = req;
                break;
            }
            case "res": {
                arg = res;
                break;
            }
            case "next": {
                arg = next;
                break;
            }
            default: {
                arg = driver.getArgument(req, metadata.injectType, metadata.paramName);
                arg = this._classTransformer.transform(metadata.paramType, arg);
                break;
            }
        }
        if (metadata.required && (arg == null || arg === undefined)) {
            throw new Error(`Can't inject required parameter: \
(${metadata.paramType}) ${metadata.paramName} is ${arg}.`);
        }
        return arg;
    }
}