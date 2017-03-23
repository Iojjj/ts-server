import {PropertyMetadataBuilder} from "../../decorator-utils/metadata/abs.property-metadata.builder";
import {CreatableType} from "../../decorator-utils/types/creatable.type";
import {InjectPropertyMetadata} from "./inject-property-metadata.bean";

/**
 * Builder for metadata of injectable properties.
 */
export class InjectPropertyMetadataBuilder
    extends PropertyMetadataBuilder<InjectPropertyMetadataBuilder, InjectPropertyMetadata> {

    private _qualifier: string | CreatableType;
    private _isLazy: boolean = false;

    constructor(metadata?: InjectPropertyMetadata) {
        super(metadata);
        if (!!metadata) {
            this._qualifier = metadata.qualifier;
            this._isLazy = metadata.isLazy;
        }
    }

    public setQualifier(val: string | CreatableType): InjectPropertyMetadataBuilder {
        this._qualifier = val;
        return this;
    }

    public setLazy(val: boolean): InjectPropertyMetadataBuilder {
        this._isLazy = val;
        return this;
    }

    public get qualifier(): string | CreatableType {
        return this._qualifier || "";
    }

    public get isLazy(): boolean {
        return this._isLazy || false;
    }

    protected getThis(): InjectPropertyMetadataBuilder {
        return this;
    }

    public build(): InjectPropertyMetadata {
        return new InjectPropertyMetadata(this);
    }

}