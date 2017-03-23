import {CreatableType} from "../types/creatable.type";
import {MetadataBuilder} from "./abs.metadata.builder";
import {PropertyMetadata} from "./abs.property-metadata.bean";

/**
 * Abstract builder for metadata of decorated properties.
 * @param B class of builder that inherits from current class
 * @param M class of metadata associated with builder class
 */
export abstract class PropertyMetadataBuilder<B extends PropertyMetadataBuilder<B, M>, M extends PropertyMetadata<B>>
    extends MetadataBuilder<B, M> {

    private _propertyName: string;
    private _type: CreatableType;

    constructor(metadata?: M) {
        super(metadata);
        if (!!metadata) {
            this._propertyName = metadata.propertyName;
            this._type = metadata.type;
        }
    }

    //noinspection JSValidateJSDoc
    /**
     * Set name of property.
     * @param val name of property
     * @return {B} instance of current builder
     */
    public setPropertyName(val: string): B {
        this._propertyName = val;
        return this.getThis();
    }

    //noinspection JSValidateJSDoc
    /**
     * Set type of property.
     * @param val type of property
     * @return {B} instance of current builder
     */
    public setType(val: CreatableType): B {
        this._type = val;
        return this.getThis();
    }

    /**
     * Name of property.
     */
    public get propertyName(): string {
        return this._propertyName || "";
    }

    /**
     * Type of property.
     */
    public get type(): CreatableType {
        return this._type;
    }
}