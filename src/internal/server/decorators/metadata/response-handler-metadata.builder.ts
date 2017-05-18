import {ResponseType} from "../../../../public/server/core/models/types/response-type";
import {MiddlewareMetadataBuilder} from "./middleware-metadata.builder";
import {ResponseHandlerMetadata} from "./response-handler-metadata.bean";

/**
 * @internal
 */
export class ResponseHandlerMetadataBuilder extends MiddlewareMetadataBuilder {

    private _responseType: ResponseType;

    constructor(metadata?: ResponseHandlerMetadata) {
        super(metadata);
        if (!!metadata) {
            this._responseType = metadata.responseType;
        }
    }

    public setResponseType(val: ResponseType): ResponseHandlerMetadataBuilder {
        this._responseType = val;
        return this;
    }

    public get responseType(): ResponseType {
        return this._responseType;
    }

    protected getThis(): ResponseHandlerMetadataBuilder {
        return this;
    }

    public build(): ResponseHandlerMetadata {
        return new ResponseHandlerMetadata(this);
    }

}