import {ParameterMetadataBuilder} from "../../../../public/decorator-utils/metadata/abs.parameter-metadata.builder";
import {SimpleMiddleware} from "../../../../public/server/core/models/base/abs.middleware";
import {MethodMetadata} from "./method-metadata.bean";
import {ParameterData} from "./parameters-metadata.bean";
import {RouteConfiguration} from "./route-configuration.bean";

/**
 * @internal
 */
export class MethodMetadataBuilder extends ParameterMetadataBuilder
    <MethodMetadataBuilder, MethodMetadata, ParameterData> {

    private _isAuthorizationRequired: boolean;
    private _routes: RouteConfiguration[] = [];
    private _beforeMiddlewares: SimpleMiddleware[] = [];
    private _afterMiddlewares: SimpleMiddleware[] = [];
    private _acceptsTypes: string[] = [];
    private _acceptsLanguages: string[] = [];

    constructor(metadata?: MethodMetadata) {
        super(metadata);
        if (!!metadata) {
            this._routes = metadata.routes ? Array.from(metadata.routes) : [];
            this._isAuthorizationRequired = metadata.isAuthorizationRequired;
            this._beforeMiddlewares = metadata.beforeMiddlewares ? Array.from(metadata.beforeMiddlewares) : [];
            this._afterMiddlewares = metadata.afterMiddlewares ? Array.from(metadata.afterMiddlewares) : [];
            this._acceptsTypes = metadata.acceptsTypes ? Array.from(metadata.acceptsTypes) : [];
            this._acceptsLanguages = metadata.acceptsLanguages ? Array.from(metadata.acceptsLanguages) : [];
        }
    }

    public addRouteConfiguration(config: RouteConfiguration): MethodMetadataBuilder {
        this._routes.push(config);
        return this;
    }

    public removeRouteConfiguration(config: RouteConfiguration): MethodMetadataBuilder {
        const index = this._routes.indexOf(config);
        if (index > -1) {
            this._routes.splice(index, 1);
        }
        return this;
    }

    public clearRouteConfigurations(): MethodMetadataBuilder {
        this._routes.splice(0);
        return this;
    }

    public setAuthorizationRequired(val: boolean): MethodMetadataBuilder {
        this._isAuthorizationRequired = val;
        return this;
    }

    public setBeforeMiddlewares(val: SimpleMiddleware[]): MethodMetadataBuilder {
        this._beforeMiddlewares = val;
        return this;
    }

    public setAfterMiddlewares(val: SimpleMiddleware[]): MethodMetadataBuilder {
        this._afterMiddlewares = val;
        return this;
    }

    public setAcceptsTypes(val: string[]): MethodMetadataBuilder {
        this._acceptsTypes = val ? Array.from(val) : [];
        return this;
    }

    public setAcceptsLanguages(val: string[]): MethodMetadataBuilder {
        this._acceptsLanguages = val ? Array.from(val) : [];
        return this;
    }

    public get routes(): RouteConfiguration[] {
        return Array.from(this._routes);
    }

    public get isAuthorizationRequired(): boolean {
        return this._isAuthorizationRequired || false;
    }

    public get beforeMiddlewares(): SimpleMiddleware[] {
        return Array.from(this._beforeMiddlewares);
    }

    public get afterMiddlewares(): SimpleMiddleware[] {
        return Array.from(this._afterMiddlewares);
    }

    public get acceptsTypes(): string[] {
        return Array.from(this._acceptsTypes);
    }

    public get acceptsLanguages(): string[] {
        return Array.from(this._acceptsLanguages);
    }

    protected getThis(): MethodMetadataBuilder {
        return this;
    }

    public build(): MethodMetadata {
        return new MethodMetadata(this);
    }

}