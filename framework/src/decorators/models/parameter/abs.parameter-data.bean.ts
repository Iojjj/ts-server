import {AbsParameterDataBuilder} from "./abs.parameter-data.builder";
import {Bean} from "../../../common/bean";
import {AnyType} from "../../type";

/**
 * Data related to decorated parameter or method.
 */
export abstract class AbsParameterData<B extends AbsParameterDataBuilder<B, AbsParameterData<B>>> extends Bean<B> {

    /**
     * Index of parameter.
     */
    public readonly index: number;

    /**
     * Type of parameter.
     */
    public readonly type: AnyType;

    constructor(builder: B) {
        super(builder);
        this.index = builder.index;
        this.type = builder.type;
    }
}