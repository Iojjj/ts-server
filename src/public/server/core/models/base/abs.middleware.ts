import {Component} from "../../../../di/decorators/class.component.decorator";
import {Inject} from "../../../../di/decorators/prop.inject.decorator";
import {CoreSharedModule} from "../../../../../internal/server/core/modules/shared.module";
import {TypeUtils} from "../../../../../internal/server/core/utils/type.utils";

@Component(CoreSharedModule)
export abstract class SimpleMiddleware {

    @Inject()
    private readonly _typeUtils: TypeUtils;

    public execute(...args: any[]): Promise<any> {
        const res = this.run(...args);
        return this._typeUtils.asPromise(res);
    };

    protected abstract run(...args: any[]): Promise<any> | any;
}