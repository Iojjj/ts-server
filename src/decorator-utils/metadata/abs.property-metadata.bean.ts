import {Metadata} from "./abs.metadata.bean";
import {PropertyMetadataBuilder} from "./abs.property-metadata.builder";

/**
 * Abstract metadata class for decorated properties of classes.
 * @param B class of builder that constructs new instances of current class
 */
export abstract class PropertyMetadata<B extends PropertyMetadataBuilder<B, PropertyMetadata<B>>>
    extends Metadata<B> {

    /**
     * Name of property.
     */
    public readonly propertyName: string;

    /**
     * Type of property.
     */
    public readonly type: Function;

    constructor(builder: B) {
        super(builder);
        this.propertyName = builder.propertyName;
        this.type = builder.type;
    }
}