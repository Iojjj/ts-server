import {ParameterMetadata} from "../../../../public/decorator-utils/metadata/abs.parameter-metadata.bean";
import {MiddlewareMetadataBuilder} from "./middleware-metadata.builder";
import {ParameterData} from "./parameters-metadata.bean";

/**
 * @internal
 */
export class MiddlewareMetadata extends ParameterMetadata<MiddlewareMetadataBuilder, ParameterData> {

    constructor(builder: MiddlewareMetadataBuilder) {
        super(builder);
    }

    public newBuilder(): MiddlewareMetadataBuilder {
        return new MiddlewareMetadataBuilder(this);
    }

}