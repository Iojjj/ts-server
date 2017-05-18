import {Bean} from "../../common/beans/abs.bean";
import {CreatableType} from "../types/creatable.type";
import {ParameterDataBuilder} from "./abs.parameter-data.builder";

/**
 * Abstract data class that related to decorated parameter of method.
 * @param B class of builder that constructs new instances of current class
 */
export abstract class ParameterData<B extends ParameterDataBuilder<B, ParameterData<B>>> extends Bean<B> {

    /**
     * Index of parameter.
     */
    public readonly index: number;

    /**
     * Type of parameter.
     */
    public readonly type: CreatableType;

    constructor(builder: B) {
        super(builder);
        this.index = builder.index;
        this.type = builder.type;
    }
}