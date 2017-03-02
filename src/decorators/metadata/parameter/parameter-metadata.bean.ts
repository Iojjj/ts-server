import {ParameterMetadataBuilder} from "./parameter-metadata.builder";
import {AbsParameterMetadata} from "./abs.parameter-metadata.bean";

/**
 * Implementation of injectable parameter metadata.
 */
export class ParameterMetadata extends AbsParameterMetadata<ParameterMetadataBuilder> {

    public newBuilder(): ParameterMetadataBuilder {
        return new ParameterMetadataBuilder(this);
    }
}