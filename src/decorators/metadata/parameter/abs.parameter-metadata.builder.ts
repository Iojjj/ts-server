import {AbsParameterMetadata} from "./abs.parameter-metadata.bean";
import {MetadataBuilder} from "../metadata.builder";
import {AbsParameterData} from "../../models/parameter/abs.parameter-data.bean";

export abstract class AbsParameterMetadataBuilder
<B extends AbsParameterMetadataBuilder<B, M>, M extends AbsParameterMetadata<B>> extends MetadataBuilder<B, M> {

    private _methodName: string;
    private _totalArgsCount: number;
    private _parameters: AbsParameterData<any>[];

    constructor(metadata?: M) {
        super(metadata);
        if (!!metadata) {
            this._methodName = metadata.methodName;
            this._totalArgsCount = metadata.totalArgsCount;
            this._parameters = metadata.parameters ? Array.from(metadata.parameters) : [];
        }
    }

    public setMethodName(val: string): B {
        this._methodName = val;
        return this.getThis();
    }

    public setTotalArgsCount(val: number): B {
        this._totalArgsCount = val;
        return this.getThis();
    }

    public addParameter(val: AbsParameterData<any>): B {
        this._parameters.push(val);
        return this.getThis();
    }

    //noinspection JSUnusedGlobalSymbols
    public removeParameter(val: AbsParameterData<any>): B {
        const index = this._parameters.indexOf(val);
        if (index > -1) {
            this._parameters.splice(index, 1);
        }
        return this.getThis();
    }

    public get methodName(): string {
        return this._methodName;
    }

    public get totalArgsCount(): number {
        return this._totalArgsCount;
    }

    public get parameters(): AbsParameterData<any>[] {
        return this._parameters;
    }
}