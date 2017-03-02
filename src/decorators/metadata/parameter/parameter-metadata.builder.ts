import {ParameterMetadata} from "./parameter-metadata.bean";
import {AbsParameterMetadataBuilder} from "./abs.parameter-metadata.builder";

export class ParameterMetadataBuilder extends AbsParameterMetadataBuilder<ParameterMetadataBuilder, ParameterMetadata> {

    protected getThis(): ParameterMetadataBuilder {
        return this;
    }

    public build(): ParameterMetadata {
        return new ParameterMetadata(this);
    }
}