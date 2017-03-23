import {PropertyMetadata} from "../../decorator-utils/metadata/abs.property-metadata.bean";
import {CreatableType} from "../../decorator-utils/types/creatable.type";
import {InjectPropertyMetadataBuilder} from "./inject-property-metadata.builder";

/**
 * Metadata for {@link Inject} decorator.
 */
export class InjectPropertyMetadata extends PropertyMetadata<InjectPropertyMetadataBuilder> {

    public readonly qualifier: string | CreatableType;
    public readonly isLazy: boolean = false;

    constructor(builder: InjectPropertyMetadataBuilder) {
        super(builder);
        this.qualifier = builder.qualifier;
        this.isLazy = builder.isLazy;
    }

    public newBuilder(): InjectPropertyMetadataBuilder {
        return new InjectPropertyMetadataBuilder(this);
    }

}