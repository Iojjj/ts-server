import {MethodMetadataBuilder} from "../../decorator-utils/metadata/abs.method-metadata.builder";
import {CreatableType} from "../../decorator-utils/types/creatable.type";
import {ProvidesMetadata} from "./provides-metadata.bean";

/**
 * Builder for a provider metadata.
 */
export class ProvidesMetadataBuilder extends MethodMetadataBuilder<ProvidesMetadataBuilder, ProvidesMetadata> {

    private _type: CreatableType;
    private _qualifier: string | CreatableType;
    private _method?: Function;
    private _isSingleton: boolean;

    constructor(metadata?: ProvidesMetadata) {
        super(metadata);
        if (!!metadata) {
            this._type = metadata.type;
            this._qualifier = metadata.qualifier;
            this._method = metadata.method;
            this._isSingleton = metadata.isSingleton;
        }
    }

    public setType(val: CreatableType): ProvidesMetadataBuilder {
        this._type = val;
        return this;
    }

    public setQualifier(val: string | CreatableType): ProvidesMetadataBuilder {
        this._qualifier = val;
        return this;
    }

    public setMethod(val: Function): ProvidesMetadataBuilder {
        this._method = val;
        return this;
    }

    public setSingleton(val: boolean): ProvidesMetadataBuilder {
        this._isSingleton = val;
        return this;
    }

    public get type(): CreatableType {
        return this._type || Object;
    }

    public get qualifier(): string | CreatableType {
        return this._qualifier;
    }

    public get method(): Function | undefined {
        return this._method;
    }

    public get isSingleton(): boolean {
        return this._isSingleton || false;
    }

    protected getThis(): ProvidesMetadataBuilder {
        return this;
    }

    public build(): ProvidesMetadata {
        return new ProvidesMetadata(this);
    }

}