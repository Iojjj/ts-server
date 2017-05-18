import {ParameterMetadata} from "../../../../public/decorator-utils/metadata/abs.parameter-metadata.bean";
import {Component} from "../../../../public/di/decorators/class.component.decorator";
import {Inject} from "../../../../public/di/decorators/prop.inject.decorator";
import {TypeTransformer} from "../../../../public/type-transformation/models/type-transformer";
import {ParameterData} from "../../decorators/metadata/parameters-metadata.bean";
import {ErrorStatusCodes} from "../../../../public/server/core/status-codes/error.status-codes";
import {HttpError} from "../../../../public/server/core/errors/http-error";
import {SimpleMiddleware} from "../../../../public/server/core/models/base/abs.middleware";
import {CoreSharedModule} from "../modules/shared.module";
import {TypeUtils} from "../utils/type.utils";

/**
 * @internal
 */
@Component(CoreSharedModule)
export class InjectableMiddleware extends SimpleMiddleware {

    private readonly _targetName: string;
    private readonly _methodName: string;
    private readonly _parametersData: ParameterData[];
    private readonly _totalArgsCount: number;
    private readonly _object: Record<string, Function | undefined>;

    @Inject()
    private readonly _typeTransformer: TypeTransformer;

    @Inject()
    private readonly typeUtils: TypeUtils;

    public constructor(metadata: ParameterMetadata<any, any>, object: any) {
        super();
        this._targetName = metadata.targetName;
        this._methodName = metadata.methodName;
        this._totalArgsCount = metadata.totalArgsCount;
        this._parametersData = metadata.parameters;
        this._object = object;
    }

    protected run(...args: any[]): Promise<any> {
        const indexes = [];
        for (let i = 0; i < this._totalArgsCount; i++) {
            indexes.push(i);
        }
        const newArgs = indexes
            .map(index => this._parametersData.find(p => p.index === index))
            .map((p, index) => {
                if (!p) {
                    return args[index];
                }
                const param = p.injectType.extract(...args);
                this.validateParameter(p, param);
                return this.transformParameter(p, param);
            });
        const method = this._object[this._methodName];
        if (!method) {
            throw new Error(`${this._targetName}.${this._methodName}: method not defined.`);
        }
        const result = method.apply(this._object, newArgs);
        return this.typeUtils.asPromise(result);
    }

    private validateParameter(p: ParameterData, param: any): void {
        if (!(p.isRequired && !param)) {
            return;
        }
        throw HttpError.newError(ErrorStatusCodes.BAD_REQUEST,
            `${this._targetName}.${this._methodName}: parameter at index ${p.index} is required, but not defined`);
    }

    private transformParameter(p: ParameterData, param: any): any {
        try {
            return this._typeTransformer.transform(param, p.type);
        } catch (error) {
            // nothing to do
        }
        return param;
    }
}