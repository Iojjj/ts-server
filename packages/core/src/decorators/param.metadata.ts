import {ParamType} from "../server.types";

/**
 * Injectable parameter metadata.
 */
export interface ParamMetadata {

    /**
     * Parameter name. It's used as a property key: <code>req.query[paramName]</code>.
     */
    readonly paramName: string;

    /**
     * Index of parameter in method's signature
     */
    readonly paramIndex: number;

    /**
     * Type of parameter.
     */
    readonly paramType: any;

    /**
     * Injectable type of parameter.
     */
    readonly injectType: ParamType;

    /**
     * Flag indicates that parameter is required.
     */
    readonly required: boolean;
}

/**
 * Implementation of injectable parameter metadata.
 */
export class ParamMetadataImpl implements ParamMetadata {

    private _paramName: string;
    private _paramIndex: number;
    private _paramType: any;
    private _injectType: ParamType;
    private _required: boolean;

    public get paramName(): string {
        return this._paramName;
    }

    public set paramName(value: string) {
        this._paramName = value;
    }

    public get paramIndex(): number {
        return this._paramIndex;
    }

    public set paramIndex(value: number) {
        this._paramIndex = value;
    }

    public get paramType(): any {
        return this._paramType;
    }

    public set paramType(value: any) {
        this._paramType = value;
    }

    public get injectType(): ParamType {
        return this._injectType;
    }

    public set injectType(value: ParamType) {
        this._injectType = value;
    }

    public get required(): boolean {
        return this._required;
    }

    public set required(value: boolean) {
        this._required = value;
    }
}