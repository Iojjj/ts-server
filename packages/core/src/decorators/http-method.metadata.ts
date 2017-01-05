import {RouteType, HttpMethodName, ResponseType, DriverMiddleware} from "../server.types";

/**
 * HTTP method metadata.
 */
export interface HttpMethodMetadata {

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
    readonly action: DriverMiddleware;

    /**
     * Return type of controller's action.
     */
    readonly returnType: PromiseLike<any> | any;

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

/**
 * Implementation of HTTP method metadata.
 */
export class HttpMethodMetadataImpl implements HttpMethodMetadata {

    private _route: RouteType;
    private _httpMethodName: HttpMethodName;
    private _action: DriverMiddleware;
    private _returnType: PromiseLike<any> | any;
    private _authorizationRequired: boolean;
    private _responseType: ResponseType;
    private _renderTemplate: string | undefined;

    public get route(): RouteType {
        return this._route;
    }

    public get httpMethodName(): HttpMethodName {
        return this._httpMethodName;
    }

    public get action(): DriverMiddleware {
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

    public set route(value: RouteType) {
        this._route = value;
    }

    public set httpMethodName(value: HttpMethodName) {
        this._httpMethodName = value;
    }

    public set action(value: DriverMiddleware) {
        this._action = value;
    }

    public set returnType(value: PromiseLike<any>|any) {
        this._returnType = value;
    }

    public set authorizationRequired(value: boolean) {
        this._authorizationRequired = value;
    }

    public set responseType(value: ResponseType) {
        this._responseType = value;
    }

    public get renderTemplate(): string|undefined {
        return this._renderTemplate;
    }

    public set renderTemplate(value: string|undefined) {
        this._renderTemplate = value;
    }
}