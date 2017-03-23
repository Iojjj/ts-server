import {ParameterData as ParameterData2} from "../../../../decorator-utils/metadata/abs.parameter-data.bean";
import {ParameterExtractor} from "../../../core/models/types/parameter-extractor.type";
import {ParameterDataBuilder} from "./parameters-metadata.builder";

/**
 * @internal
 */
export class ParameterData extends ParameterData2<ParameterDataBuilder> {

    public readonly injectType: ParameterExtractor;
    public readonly injectName: string;
    public readonly isRequired: boolean;

    constructor(builder: ParameterDataBuilder) {
        super(builder);
        this.injectType = builder.injectType;
        this.injectName = builder.injectName;
        this.isRequired = builder.isRequired;
    }

    public newBuilder(): ParameterDataBuilder {
        return new ParameterDataBuilder(this);
    }

}