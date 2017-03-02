import {RoseParameterDataBuilder} from "./parameter-data.builder";
import {AbsParameterData} from "../../decorators/models/parameter/abs.parameter-data.bean";

export class RoseParameterData extends AbsParameterData<RoseParameterDataBuilder> {

    public readonly qualifierName: string;

    constructor(builder: RoseParameterDataBuilder) {
        super(builder);
        this.qualifierName = builder.qualifierName;
    }

    public newBuilder(): RoseParameterDataBuilder {
        return new RoseParameterDataBuilder(this);
    }
}