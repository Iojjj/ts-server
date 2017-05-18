import {MethodMetadataBuilder} from "../../../public/decorator-utils/metadata/abs.method-metadata.builder";
import {CreatableType} from "../../../public/decorator-utils/types/creatable.type";
import {ProvidesMetadata} from "./provides-metadata.bean";
import {Constants} from "../constants";

/**
 * Builder for a provider metadata.
 */
export class ProvidesMetadataBuilder extends MethodMetadataBuilder<ProvidesMetadataBuilder, ProvidesMetadata> {

    private _type: CreatableType;
    private _qualifier?: symbol;
    private _method?: Function;
    private _scope: symbol = Constants.LOCAL_SCOPE;

    constructor(metadata?: ProvidesMetadata) {
        super(metadata);
        if (!!metadata) {
            this._type = metadata.type;
            this._qualifier = metadata.qualifier;
            this._method = metadata.method;
            this._scope = metadata.scope;
        }
    }

    public setType(val: CreatableType): ProvidesMetadataBuilder {
        this._type = val;
        return this;
    }

    public setQualifier(val?: symbol): ProvidesMetadataBuilder {
        this._qualifier = val;
        return this;
    }

    public setMethod(val: Function): ProvidesMetadataBuilder {
        this._method = val;
        return this;
    }

    public setScope(val: symbol): ProvidesMetadataBuilder {
        this._scope = val;
        return this;
    }

    public get type(): CreatableType {
        return this._type || Object;
    }

    public get qualifier(): symbol|undefined {
        return this._qualifier;
    }

    public get method(): Function | undefined {
        return this._method;
    }

    public get scope(): symbol {
        return this._scope;
    }

    protected getThis(): ProvidesMetadataBuilder {
        return this;
    }

    public build(): ProvidesMetadata {
        return new ProvidesMetadata(this);
    }

}