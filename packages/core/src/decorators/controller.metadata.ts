import {HttpMethodMetadata} from "./http-method.metadata";
import {RouteType} from "../server.types";

/**
 * Controller's metadata.
 */
export interface ControllerMetadata {

    /**
     * Controller's route.
     */
    readonly route: RouteType;

    /**
     * List of controller's actions.
     */
    readonly httpMethods: HttpMethodMetadata[];

    /**
     * Server's prefix for controller's route.
     */
    readonly prefix: string;

    /**
     * API version of controller.
     */
    readonly version: string;
}

/**
 * Implementation of controller's metadata.
 */
export class ControllerMetadataImpl implements ControllerMetadata {

    private _route: string | RegExp|undefined;
    private _version: string;
    private _prefix: string;
    private _httpMethods: HttpMethodMetadata[];

    constructor() {
        this._httpMethods = [];
    }

    public get route(): string|RegExp|any {
        return this._route;
    }

    public set route(value: string|RegExp|any) {
        this._route = value;
    }

    public get version(): string {
        return this._version;
    }

    public set version(value: string) {
        this._version = value;
    }

    public get prefix(): string {
        return this._prefix;
    }

    public set prefix(value: string) {
        this._prefix = value;
    }

    public get httpMethods(): HttpMethodMetadata[] {
        return this._httpMethods;
    }

    public set httpMethods(value: HttpMethodMetadata[]) {
        this._httpMethods = value;
    }
}