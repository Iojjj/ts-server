import {PropertyMetadataBuilder} from "./property-metadata.builder";
import {AbsPropertyMetadata} from "./abs.property-metadata.bean";

export class PropertyMetadata extends AbsPropertyMetadata<PropertyMetadataBuilder> {

    constructor(builder: PropertyMetadataBuilder) {
        super(builder);
    }

    public newBuilder(): PropertyMetadataBuilder {
        return new PropertyMetadataBuilder(this);
    }
}