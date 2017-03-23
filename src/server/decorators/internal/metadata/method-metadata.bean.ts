import {ParameterMetadata} from "../../../../decorator-utils/metadata/abs.parameter-metadata.bean";
import {SimpleMiddleware} from "../../../core/models/base/abs.middleware";
import {MethodMetadataBuilder} from "./method-metadata.builder";
import {ParameterData} from "./parameters-metadata.bean";
import {RouteConfiguration} from "./route-configuration.bean";

/**
 * @internal
 */
export class MethodMetadata extends ParameterMetadata<MethodMetadataBuilder, ParameterData> {

    public readonly routes: RouteConfiguration[];
    public readonly isAuthorizationRequired: boolean;
    public readonly beforeMiddlewares: SimpleMiddleware[];
    public readonly afterMiddlewares: SimpleMiddleware[];
    public readonly acceptsTypes: string[];
    public readonly acceptsLanguages: string[];

    constructor(builder: MethodMetadataBuilder) {
        super(builder);
        this.routes = builder.routes;
        this.isAuthorizationRequired = builder.isAuthorizationRequired;
        this.beforeMiddlewares = builder.beforeMiddlewares;
        this.afterMiddlewares = builder.afterMiddlewares;
        this.acceptsTypes = builder.acceptsTypes;
        this.acceptsLanguages = builder.acceptsLanguages;
    }

    public newBuilder(): MethodMetadataBuilder {
        return new MethodMetadataBuilder(this);
    }

}