import {ParameterData} from "./parameter-data.bean";
import {AbsParameterDataBuilder} from "./abs.parameter-data.builder";

/**
 * Implementation of builder for method's parameter data.
 */
export class ParameterDataBuilder extends AbsParameterDataBuilder<ParameterDataBuilder, ParameterData> {

    protected getThis(): ParameterDataBuilder {
        return this;
    }

    public build(): ParameterData {
        return new ParameterData(this);
    }
}