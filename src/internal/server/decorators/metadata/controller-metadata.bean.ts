import {Metadata} from "../../../../public/decorator-utils/metadata/abs.metadata.bean";
import {ResponseType} from "../../../../public/server/core/models/types/response-type";
import {Route} from "../../../../public/server/core/models/types/route.type";
import {ControllerMetadataBuilder} from "./controller-metadata.builder";
import {MethodMetadata} from "./method-metadata.bean";

/**
 * @internal
 */
export class ControllerMetadata extends Metadata<ControllerMetadataBuilder> {

    public readonly version: string;
    public readonly route: Route;
    public readonly responseType: ResponseType;
    public readonly methodMetadata: Map<string, MethodMetadata>;

    constructor(builder: ControllerMetadataBuilder) {
        super(builder);
        this.version = builder.version;
        this.route = builder.route;
        this.responseType = builder.responseType;
        this.methodMetadata = builder.methodMetadata;
    }

    public newBuilder(): ControllerMetadataBuilder {
        return new ControllerMetadataBuilder(this);
    }

}