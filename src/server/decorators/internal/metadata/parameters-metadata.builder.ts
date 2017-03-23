import {ParameterDataBuilder as ParDataBuilder} from "../../../../decorator-utils/metadata/abs.parameter-data.builder";
import {ParameterExtractor} from "../../../core/models/types/parameter-extractor.type";
import {ParameterData} from "./parameters-metadata.bean";

/**
 * @internal
 */
export class ParameterDataBuilder extends ParDataBuilder<ParameterDataBuilder, ParameterData> {

    private _injectType: ParameterExtractor;
    private _injectName: string;
    private _isRequired: boolean;

    constructor(metadata?: ParameterData) {
        super(metadata);
        if (!!metadata) {
            this._injectType = metadata.injectType;
            this._injectName = metadata.injectName;
            this._isRequired = metadata.isRequired;
        }
    }

    public setInjectType(val: ParameterExtractor): ParameterDataBuilder {
        this._injectType = val;
        return this;
    }

    public setInjectName(val: string): ParameterDataBuilder {
        this._injectName = val;
        return this;
    }

    public setRequired(val: boolean): ParameterDataBuilder {
        this._isRequired = val;
        return this;
    }

    public get injectType(): ParameterExtractor {
        return this._injectType;
    }

    public get injectName(): string {
        return this._injectName || "";
    }

    public get isRequired(): boolean {
        return this._isRequired || false;
    }

    protected getThis(): ParameterDataBuilder {
        return this;
    }

    public build(): ParameterData {
        return new ParameterData(this);
    }

}