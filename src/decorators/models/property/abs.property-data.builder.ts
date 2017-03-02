import {AbsPropertyData} from "./abs.property-data.bean";
import {BeanBuilder} from "../../../common/bean.builder";
import {AnyType} from "../../type";

export abstract class AbsPropertyDataBuilder<B extends  AbsPropertyDataBuilder<B, M>, M extends AbsPropertyData<B>>
extends BeanBuilder<B, M> {

    private _type: AnyType;
    private _propertyName: string;

    constructor(model?: M) {
        super(model);
        if (!!model) {
            this._type = model.type;
            this._propertyName = model.propertyName;
        }
    }

    public setType(val: AnyType): B {
        this._type = val;
        return this.getThis();
    }

    public setPropertyName(val: string): B {
        this._propertyName = val;
        return this.getThis();
    }

    public get type(): AnyType {
        return this._type;
    }

    public get propertyName(): string {
        return this._propertyName;
    }
}