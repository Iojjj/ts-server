import {ResponseType} from "../../../core/models/types/response-type";
import {MiddlewareMetadata} from "./middleware-metadata.bean";
import {ResponseHandlerMetadataBuilder} from "./response-handler-metadata.builder";

/**
 * @internal
 */
export class ResponseHandlerMetadata extends MiddlewareMetadata {

    public readonly responseType: ResponseType;

    constructor(builder: ResponseHandlerMetadataBuilder) {
        super(builder);
        this.responseType = builder.responseType;
    }

    public newBuilder(): ResponseHandlerMetadataBuilder {
        return new ResponseHandlerMetadataBuilder(this);
    }

}