import {PropertyMetadata} from "../../../decorator-utils/metadata/abs.property-metadata.bean";
import {InjectPropertyMetadataBuilder} from "./inject-property-metadata.builder";

/**
 * Metadata for {@link Inject} decorator.
 */
export class InjectPropertyMetadata extends PropertyMetadata<InjectPropertyMetadataBuilder> {

    public readonly qualifier?: symbol;
    public readonly isLazy: boolean = false;
    public readonly scope: symbol;

    constructor(builder: InjectPropertyMetadataBuilder) {
        super(builder);
        this.qualifier = builder.qualifier;
        this.isLazy = builder.isLazy;
        this.scope = builder.scope;
    }

    public newBuilder(): InjectPropertyMetadataBuilder {
        return new InjectPropertyMetadataBuilder(this);
    }

}