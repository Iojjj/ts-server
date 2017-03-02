import {PropertyMetadata} from "./property-metadata.bean";
import {AbsPropertyMetadataBuilder} from "./abs.property-metadata.builder";

export class PropertyMetadataBuilder extends AbsPropertyMetadataBuilder<PropertyMetadataBuilder, PropertyMetadata> {

    protected getThis(): PropertyMetadataBuilder {
        return this;
    }

    public build(): PropertyMetadata {
        return new PropertyMetadata(this);
    }
}