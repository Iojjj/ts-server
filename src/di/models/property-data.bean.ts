import {RosePropertyDataBuilder} from "./property-data.builder";
import {AbsPropertyData} from "../../decorators/models/property/abs.property-data.bean";

export class RosePropertyData extends AbsPropertyData<RosePropertyDataBuilder> {

    public readonly qualifierName: string;
    public readonly isLazy: boolean = false;

    constructor(builder: RosePropertyDataBuilder) {
        super(builder);
        this.qualifierName = builder.qualifierName;
        this.isLazy = builder.isLazy;
    }

    public newBuilder(): RosePropertyDataBuilder {
        return new RosePropertyDataBuilder(this);
    }

}