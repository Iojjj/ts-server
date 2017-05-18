import {ParameterMetadataBuilder} from "../../../../public/decorator-utils/metadata/abs.parameter-metadata.builder";
import {MiddlewareMetadata} from "./middleware-metadata.bean";
import {ParameterData} from "./parameters-metadata.bean";

/**
 * @internal
 */
export class MiddlewareMetadataBuilder extends
    ParameterMetadataBuilder<MiddlewareMetadataBuilder, MiddlewareMetadata, ParameterData> {

    protected getThis(): MiddlewareMetadataBuilder {
        return this;
    }

    public build(): MiddlewareMetadata {
        return new MiddlewareMetadata(this);
    }

}