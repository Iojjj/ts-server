import {MetadataBuilder} from "../metadata.builder";
import {AbsPropertyMetadata} from "./abs.property-metadata.bean";

export abstract class AbsPropertyMetadataBuilder
<B extends AbsPropertyMetadataBuilder<B, M>, M extends AbsPropertyMetadata<B>> extends MetadataBuilder<B, M> {

    private _propertyName: string;

    constructor(metadata?: M) {
        super(metadata);
        if (!!metadata) {
            this._propertyName = metadata.propertyName;
        }
    }

    public setPropertyName(val: string): B {
        this._propertyName = val;
        return this.getThis();
    }

    public get propertyName(): string {
        return this._propertyName;
    }
}