import {RouteType, ResponseType, MiddlewareInterface} from "../../server.types";
import {HttpMethodName} from "./http-method.types";
import {Metadata, MetadataBuilder, AbstractMetadata} from "../../../../decorators/src/metadata";

/**
 * HTTP method metadata.
 */
export interface HttpMethodMetadata extends Metadata<HttpMethodMetadataBuilder> {

    /**
     * Route of controller's action.
     */
    readonly route: RouteType;

    /**
     * HTP method name of controller's action.
     */
    readonly httpMethodName: HttpMethodName;

    /**
     * Function-wrapper that would be called instead of original method.
     */
    readonly action: MiddlewareInterface;

    /**
     * Return type of controller's action.
     */
    readonly returnType: any;

    // TODO: action can be wrapped or middleware used for this
    /**
     * Flag indicates that server must check if user is authorized before executing this action.
     */
    readonly authorizationRequired: boolean;

    /**
     * Type of response of this action.
     */
    readonly responseType: ResponseType;

    /**
     * Name of the view that should be rendered.
     */
    readonly renderTemplate: string | undefined;
}

export class HttpMethodMetadataBuilder extends MetadataBuilder<HttpMethodMetadataBuilder, HttpMethodMetadata> {

    private _route: RouteType;
    private _httpMethodName: HttpMethodName;
    private _action: MiddlewareInterface;
    private _returnType: PromiseLike<any> | any;
    private _authorizationRequired: boolean = false;
    private _responseType: ResponseType;
    private _renderTemplate: string | undefined;
    
    constructor(metadata?: HttpMethodMetadata) {
        super(metadata);
        if (metadata) {
            this._route = metadata.route;
            this._httpMethodName = metadata.httpMethodName;
            this._action = metadata.action;
            this._returnType = metadata.returnType;
            this._authorizationRequired = metadata.authorizationRequired;
            this._responseType = metadata.responseType;
            this._renderTemplate = metadata.renderTemplate;
        }
    }

    protected getThis(): HttpMethodMetadataBuilder {
        return this;
    }
    
    public setRoute(val: RouteType): HttpMethodMetadataBuilder {
        this._route = val;
        return this;
    }
    
    public setHttpMethodName(val: HttpMethodName): HttpMethodMetadataBuilder {
        this._httpMethodName = val;
        return this;
    }

    public setAction(val: MiddlewareInterface): HttpMethodMetadataBuilder {
        this._action = val;
        return this;
    }
    
    public setReturnType(val: any): HttpMethodMetadataBuilder {
        this._returnType = val;
        return this;
    }

    public setAuthorizationRequired(val: boolean): HttpMethodMetadataBuilder {
        this._authorizationRequired = val;
        return this;
    }

    public setResponseType(val: ResponseType): HttpMethodMetadataBuilder {
        this._responseType = val;
        return this;
    }
    
    public setRenderTemplate(val: string|undefined): HttpMethodMetadataBuilder {
        this._renderTemplate = val;
        return this;
    }

    public get route(): RouteType {
        return this._route;
    }

    public get httpMethodName(): HttpMethodName {
        return this._httpMethodName;
    }

    public get action(): MiddlewareInterface {
        return this._action;
    }

    public get returnType(): PromiseLike<any>|any {
        return this._returnType;
    }

    public get authorizationRequired(): boolean {
        return this._authorizationRequired;
    }

    public get responseType(): ResponseType {
        return this._responseType;
    }

    public get renderTemplate(): string|any {
        return this._renderTemplate;
    }

    public build(): HttpMethodMetadata {
        return new HttpMethodMetadataImpl(this);
    }
}

/**
 * Implementation of HTTP method metadata.
 */
class HttpMethodMetadataImpl extends AbstractMetadata<HttpMethodMetadataBuilder>
    implements HttpMethodMetadata {

    private _route: RouteType;
    private _httpMethodName: HttpMethodName;
    private _action: MiddlewareInterface;
    private _returnType: PromiseLike<any> | any;
    private _authorizationRequired: boolean;
    private _responseType: ResponseType;
    private _renderTemplate: string | undefined;

    constructor(builder: HttpMethodMetadataBuilder) {
        super(builder);
        this._route = builder.route;
        this._httpMethodName = builder.httpMethodName;
        this._action = builder.action;
        this._returnType = builder.returnType;
        this._authorizationRequired = builder.authorizationRequired;
        this._responseType = builder.responseType;
        this._renderTemplate = builder.renderTemplate;
    }

    public get route(): RouteType {
        return this._route;
    }

    public get httpMethodName(): HttpMethodName {
        return this._httpMethodName;
    }

    public get action(): MiddlewareInterface {
        return this._action;
    }

    public get returnType(): PromiseLike<any>|any {
        return this._returnType;
    }

    public get authorizationRequired(): boolean {
        return this._authorizationRequired;
    }

    public get responseType(): ResponseType {
        return this._responseType;
    }

    public get renderTemplate(): string|any {
        return this._renderTemplate;
    }

    public newBuilder(): HttpMethodMetadataBuilder {
        return new HttpMethodMetadataBuilder(this);
    }
}