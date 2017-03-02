import {MiddlewareInterface} from "../../server.types";
import {HttpMethodMetadata} from "./http-method.metadata";
import {ParamMetadata} from "../parameters/param.metadata";
import {SimpleCompositeMiddleware} from "../../utils/composite.middleware";
import {Logger} from "../../utils/logger";
import {TypeTransformer} from "../../../../type-transformer/src/type.transformer";
import {Parameter} from "../parameters/param.types";
import {Check} from "../../utils/checker";
import {PromiseWrapper} from "../../promise.wrapper";

export class HttpMethodWrapper implements MiddlewareInterface {

    private _metadata: HttpMethodMetadata;
    private _injectParams: ParamMetadata[];
    private _originalMethod: Function;
    private _target: Object;
    private _typeTransformer: TypeTransformer;

    public static newInstance(target: Object, originalMethod: Function,
                              metadata: HttpMethodMetadata, injectParams: ParamMetadata[]): MiddlewareInterface {
        return new HttpMethodWrapper(target, originalMethod, metadata, injectParams);
    }

    private constructor(target: Object, originalMethod: Function,
                        metadata: HttpMethodMetadata, injectParams: ParamMetadata[]) {
        this._metadata = metadata;
        this._injectParams = injectParams;
        this._originalMethod = originalMethod;
        this._target = target;
        this._typeTransformer = new TypeTransformer();
    }

    public use(req: any, res: any, next: any): any {
        const middleware = new SimpleCompositeMiddleware(() => {
            return [
                PromiseWrapper.promiseToMiddleware(this.newAuthMiddleware.bind(this)),
                PromiseWrapper.promiseToMiddleware(this.newOriginalMethodMiddleware.bind(this))
            ];
        });
        middleware.use(req, res, next);
    }

    private newAuthMiddleware(req: any, res: any): Promise<void> {
        return PromiseWrapper.wrapFunction<void>(() => {
            Logger.console().d("Auth");
            if (this._metadata.authorizationRequired) {
                Logger.console().d("implement authorization!");
            }
        });
    }

    private newOriginalMethodMiddleware(req: any, res: any): Promise<any> {
        const args = this.getArguments(this._injectParams, req, res);
        if (Check.isPromise(this._metadata.returnType)) {
            return this._originalMethod.apply(this._target, args);
        }
        return PromiseWrapper.wrapFunction(() => this._originalMethod.apply(this._target, args));
    }

    private getArguments(injectParams: ParamMetadata[], req: any, res: any): any[] {
        return injectParams
            .map(metadata => this.getArgument(metadata, req, res))
            .reduce((all, single) => all.concat(single), []);
    }

    private getArgument(metadata: ParamMetadata, req: any, res: any): any {
        let arg: any;
        switch (metadata.injectType) {
            case Parameter.REQUEST: {
                arg = req;
                break;
            }
            case Parameter.RESPONSE: {
                arg = res;
                break;
            }
            default: {
                const cont = (req as any)[metadata.injectType.container];
                if (!cont) {
                    arg = undefined;
                } else if (!metadata.paramName) {
                    arg = cont;
                } else {
                    arg = cont[metadata.paramName];
                }
                arg = this._typeTransformer
                    .transform(arg, metadata.paramType, metadata.nullValue, metadata.undefinedValue);
                break;
            }
        }
        if (metadata.required && (arg == null || arg === undefined)) {
            throw new Error(`Can't inject required parameter: \
(${metadata.paramType.name}) ${metadata.paramName} is ${arg}.`);
        }
        return arg;
    }
}