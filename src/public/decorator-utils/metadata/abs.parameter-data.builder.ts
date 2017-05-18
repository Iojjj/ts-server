import {BeanBuilder} from "../../common/beans/abs.bean.builder";
import {CreatableType} from "../types/creatable.type";
import {ParameterData} from "./abs.parameter-data.bean";

/**
 * Abstract builder for data of decorated parameters.
 * @param B class of builder that inherits from current class
 * @param M class of metadata associated with builder class
 */
export abstract class ParameterDataBuilder<B extends ParameterDataBuilder<B, M>, M extends ParameterData<B>>
    extends BeanBuilder<B, M> {

    private _index: number;
    private _type: CreatableType;

    constructor(model?: M) {
        super(model);
        if (model) {
            this._index = model.index;
            this._type = model.type;
        }
    }

    //noinspection JSValidateJSDoc
    /**
     * Set index of parameter.
     * @param val index of parameter
     * @return {B} instance of current builder
     */
    public setIndex(val: number): B {
        this._index = val;
        return this.getThis();
    }

    //noinspection JSValidateJSDoc
    /**
     * Set type of parameter.
     * @param val type of parameter
     * @return {B} instance of current builder
     */
    public setType(val: CreatableType): B {
        this._type = val;
        return this.getThis();
    }

    /**
     * Index of parameter.
     */
    public get index(): number {
        return this._index || 0;
    }

    /**
     * Type of parameter.
     */
    public get type(): CreatableType {
        return this._type || Object;
    }
}