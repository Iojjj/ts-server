import {PropertyMetadata} from "../../public/decorator-utils/metadata/abs.property-metadata.bean";
import {TransformType} from "../../public/type-transformation/models/transform-type";
import {TypedMetadataBuilder} from "./typed-metadata.builder";

/**
 * @internal
 */
export class TypedMetadata extends PropertyMetadata<TypedMetadataBuilder> {

    public readonly convertableType: TransformType<any>;

    constructor(builder: TypedMetadataBuilder) {
        super(builder);
        this.convertableType = builder.convertableType;
    }

    public newBuilder(): TypedMetadataBuilder {
        return new TypedMetadataBuilder(this);
    }

}