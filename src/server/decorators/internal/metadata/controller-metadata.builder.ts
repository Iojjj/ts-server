import {MetadataBuilder} from "../../../../decorator-utils/metadata/abs.metadata.builder";
import {ResponseType} from "../../../core/models/types/response-type";
import {Route} from "../../../core/models/types/route.type";
import {ControllerMetadata} from "./controller-metadata.bean";
import {MethodMetadata} from "./method-metadata.bean";

/**
 * @internal
 */
export class ControllerMetadataBuilder extends MetadataBuilder<ControllerMetadataBuilder, ControllerMetadata> {

    private _version: string;
    private _route: Route;
    private _responseType: ResponseType;
    private readonly _methodMetadata: Map<string, MethodMetadata>;

    constructor(metadata?: ControllerMetadata) {
        super(metadata);
        this._methodMetadata = new Map();
        if (!!metadata) {
            this._version = metadata.version;
            this._route = metadata.route;
            this._responseType = metadata.responseType;
            if (!!metadata.methodMetadata) {
                this.copyMap(metadata.methodMetadata, this._methodMetadata);
            }
        }
    }

    public setVersion(val: string): ControllerMetadataBuilder {
        this._version = val;
        return this;
    }

    public setRoute(val: Route): ControllerMetadataBuilder {
        this._route = val;
        return this;
    }

    public setResponseType(val: ResponseType): ControllerMetadataBuilder {
        this._responseType = val;
        return this;
    }

    public setMethodMetadata(val: Map<string, MethodMetadata>): ControllerMetadataBuilder {
        this.copyMap(val, this._methodMetadata);
        return this;
    }

    public get version(): string {
        return this._version || "";
    }

    public get route(): Route {
        return this._route || "";
    }

    public get responseType(): ResponseType {
        return this._responseType || ResponseType.RAW;
    }

    public get methodMetadata(): Map<string, MethodMetadata> {
        return this.copyMap(this._methodMetadata);
    }

    private copyMap(map: Map<string, MethodMetadata>,
                    toMap: Map<string, MethodMetadata> = new Map()): Map<string, MethodMetadata> {
        toMap.clear();
        map.forEach((v, k) => toMap.set(k, v));
        return toMap;
    }

    protected getThis(): ControllerMetadataBuilder {
        return this;
    }

    public build(): ControllerMetadata {
        return new ControllerMetadata(this);
    }

}