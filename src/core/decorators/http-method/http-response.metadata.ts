import {Metadata, MetadataBuilder, AbstractMetadata} from "../../../../decorators/src/metadata";
import {ResponseType} from "../../server.types";
export interface HttpResponseMetadata extends Metadata<HttpResponseMetadataBuilder> {

    readonly responseType: ResponseType;
}

export class HttpResponseMetadataBuilder extends MetadataBuilder<HttpResponseMetadataBuilder, HttpResponseMetadata> {

    private _responseType: ResponseType;

    constructor(metadata?: HttpResponseMetadata) {
        super(metadata);
        if (metadata) {
            this._responseType = metadata.responseType;
        }
    }

    public get responseType(): ResponseType {
        return this._responseType;
    }
    
    public setResponseType(val: ResponseType): HttpResponseMetadataBuilder {
        this._responseType = val;
        return this;
    }

    protected getThis(): HttpResponseMetadataBuilder {
        return this;
    }

    public build(): HttpResponseMetadata {
        return new HttpResponseMetadataImpl(this);
    }
}

class HttpResponseMetadataImpl extends AbstractMetadata<HttpResponseMetadataBuilder>
        implements HttpResponseMetadata {

    private _responseType: ResponseType;

    constructor(builder: HttpResponseMetadataBuilder) {
        super(builder);
        this._responseType = builder.responseType;
    }

    public get responseType(): ResponseType {
        return this._responseType;
    }

    public newBuilder(): HttpResponseMetadataBuilder {
        return new HttpResponseMetadataBuilder(this);
    }
}