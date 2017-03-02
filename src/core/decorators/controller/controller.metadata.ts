import {HttpMethodMetadata} from "../http-method/http-method.metadata";
import {RouteType, ResponseType} from "../../server.types";
import {Metadata, MetadataBuilder, AbstractMetadata} from "../../../../decorators/src/metadata";

/**
 * Controller's metadata.
 */
export interface ControllerMetadata extends Metadata<ControllerMetadataBuilder> {

    /**
     * Controller's route.
     */
    readonly route: RouteType;

    /**
     * List of controller's actions.
     */
    readonly httpMethods: HttpMethodMetadata[];

    /**
     * Prefix for controller's route.
     */
    readonly prefix: string;

    /**
     * API version of controller.
     */
    readonly version: string;

    readonly defaultResponseType: ResponseType;
}

export class ControllerMetadataBuilder extends MetadataBuilder<ControllerMetadataBuilder, ControllerMetadata> {

    private _route: RouteType;
    private _version: string;
    private _prefix: string;
    private _httpMethods: HttpMethodMetadata[];
    private _defaultResponseType: ResponseType;

    constructor(metadata?: ControllerMetadata) {
        super(metadata);
        if (metadata) {
            this._route = metadata.route;
            this._version = metadata.version;
            this._prefix = metadata.prefix;
            this._httpMethods = ([] as HttpMethodMetadata[]).concat(metadata.httpMethods);
            this._defaultResponseType = metadata.defaultResponseType;
        }
    }

    protected getThis(): ControllerMetadataBuilder {
        return this;
    };
    
    public setRoute(val: RouteType): ControllerMetadataBuilder {
        this._route = val;
        return this;
    }
    
    public setVersion(val: string): ControllerMetadataBuilder {
        this._version = val;
        return this;
    }

    public setPrefix(val: string): ControllerMetadataBuilder {
        this._prefix = val;
        return this;
    }

    public setHttpMethods(val: HttpMethodMetadata[]): ControllerMetadataBuilder {
        this._httpMethods = val;
        return this;
    }

    public setDefaultResponseType(val: ResponseType): ControllerMetadataBuilder {
        this._defaultResponseType = val;
        return this;
    }

    public get route(): RouteType {
        return this._route;
    }

    public get version(): string {
        return this._version;
    }

    public get prefix(): string {
        return this._prefix;
    }

    public get httpMethods(): HttpMethodMetadata[] {
        return this._httpMethods;
    }

    public get defaultResponseType(): ResponseType {
        return this._defaultResponseType;
    }

    public build(): ControllerMetadata {
        return new ControllerMetadataImpl(this);
    }
}

/**
 * Implementation of controller's metadata.
 */
class ControllerMetadataImpl extends AbstractMetadata<ControllerMetadataBuilder>
        implements ControllerMetadata {

    private _route: RouteType;
    private _version: string;
    private _prefix: string;
    private _httpMethods: HttpMethodMetadata[];
    private _defaultResponseType: ResponseType;

    constructor(builder: ControllerMetadataBuilder) {
        super(builder);
        this._route = builder.route;
        this._version = builder.version;
        this._prefix = builder.prefix;
        this._httpMethods = ([] as HttpMethodMetadata[]).concat(builder.httpMethods);
        this._defaultResponseType = builder.defaultResponseType;
    }

    public get route(): string|RegExp|any {
        return this._route;
    }

    public get version(): string {
        return this._version;
    }

    public get prefix(): string {
        return this._prefix;
    }

    public get httpMethods(): HttpMethodMetadata[] {
        return this._httpMethods;
    }

    public get defaultResponseType(): ResponseType {
        return this._defaultResponseType;
    }

    public newBuilder(): ControllerMetadataBuilder {
        return new ControllerMetadataBuilder(this);
    }
}