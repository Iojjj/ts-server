import {AbsParameterData} from "./abs.parameter-data.bean";
import {BeanBuilder} from "../../../common/bean.builder";
import {AnyType} from "../../type";

/**
 * Builder for method's parameter data.
 */
export abstract class AbsParameterDataBuilder<B extends AbsParameterDataBuilder<B, M>, M extends AbsParameterData<B>>
extends BeanBuilder<B, M> {

    private _index: number;
    private _type: AnyType;

    constructor(model?: M) {
        super(model);
        if (model) {
            this._index = model.index;
            this._type = model.type;
        }
    }

    public setIndex(val: number): B {
        this._index = val;
        return this.getThis();
    }

    public setType(val: AnyType): B {
        this._type = val;
        return this.getThis();
    }

    public get index(): number {
        return this._index;
    }

    public get type(): AnyType {
        return this._type;
    }
}