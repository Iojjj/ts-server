import {ParameterDataBuilder} from "./parameter-data.builder";
import {AbsParameterData} from "./abs.parameter-data.bean";

/**
 * Implementation of data related to decorated parameter or method.
 */
export class ParameterData extends AbsParameterData<ParameterDataBuilder> {

    public newBuilder(): ParameterDataBuilder {
        return new ParameterDataBuilder(this);
    }

}