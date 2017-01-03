import {ParamType} from "./param.type";

export interface ParamMetadata {

    readonly paramName: string;
    readonly paramIndex: number;
    readonly paramType: any;
    readonly injectType: ParamType;

}