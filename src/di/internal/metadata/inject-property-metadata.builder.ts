import {PropertyMetadataBuilder} from "../../../decorator-utils/metadata/abs.property-metadata.builder";
import {InjectPropertyMetadata} from "./inject-property-metadata.bean";
import {Constants} from "../constants";

/**
 * Builder for metadata of injectable properties.
 */
export class InjectPropertyMetadataBuilder
    extends PropertyMetadataBuilder<InjectPropertyMetadataBuilder, InjectPropertyMetadata> {

    private _qualifier?: symbol;
    private _isLazy: boolean = false;
    private _scope: symbol = Constants.LOCAL_SCOPE;

    constructor(metadata?: InjectPropertyMetadata) {
        super(metadata);
        if (!!metadata) {
            this._qualifier = metadata.qualifier;
            this._isLazy = metadata.isLazy;
            this._scope = metadata.scope;
        }
    }

    public setQualifier(val: symbol|undefined): InjectPropertyMetadataBuilder {
        this._qualifier = val;
        return this;
    }

    public setLazy(val: boolean): InjectPropertyMetadataBuilder {
        this._isLazy = val;
        return this;
    }

    public setScope(val: symbol): InjectPropertyMetadataBuilder {
        this._scope = val;
        return this;
    }

    public get qualifier(): symbol|undefined {
        return this._qualifier;
    }

    public get isLazy(): boolean {
        return this._isLazy || false;
    }

    public get scope(): symbol {
        return this._scope;
    }

    protected getThis(): InjectPropertyMetadataBuilder {
        return this;
    }

    public build(): InjectPropertyMetadata {
        return new InjectPropertyMetadata(this);
    }

}