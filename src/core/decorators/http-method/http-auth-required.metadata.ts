import {Metadata, MetadataBuilder, AbstractMetadata} from "../../../../decorators/src/metadata";

export interface AuthRequiredMetadata extends Metadata<AuthRequiredMetadataBuilder> {
    readonly required: boolean;
}

export class AuthRequiredMetadataBuilder extends MetadataBuilder<AuthRequiredMetadataBuilder, AuthRequiredMetadata> {

    private _required: boolean;

    constructor(metadata?: AuthRequiredMetadata) {
        super(metadata);
        if (metadata) {
            this._required = metadata.required;
        }
    }

    protected getThis(): AuthRequiredMetadataBuilder {
        return this;
    }

    public get required(): boolean {
        return this._required;
    }

    public setRequired(val: boolean): AuthRequiredMetadataBuilder {
        this._required = val;
        return this;
    }

    public build(): AuthRequiredMetadata {
        return new AuthRequiredMetadataImpl(this);
    }
}

class AuthRequiredMetadataImpl extends AbstractMetadata<AuthRequiredMetadataBuilder>
        implements AuthRequiredMetadata {

    private _required: boolean;

    constructor(builder: AuthRequiredMetadataBuilder) {
        super(builder);
        this._required = builder.required;
    }

    public get required(): boolean {
        return this._required;
    }

    public newBuilder(): AuthRequiredMetadataBuilder {
        return new AuthRequiredMetadataBuilder(this);
    }
}