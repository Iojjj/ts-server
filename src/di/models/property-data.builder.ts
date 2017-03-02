import {RosePropertyData} from "./property-data.bean";
import {AbsPropertyDataBuilder} from "../../decorators/models/property/abs.property-data.builder";

export class RosePropertyDataBuilder extends AbsPropertyDataBuilder<RosePropertyDataBuilder, RosePropertyData> {

    private _qualifierName: string;
    private _isLazy: boolean = false;

    constructor(model?: RosePropertyData) {
        super(model);
        if (!!model) {
            this._qualifierName = model.qualifierName;
            this._isLazy = model.isLazy;
        }
    }

    public setQualifierName(val: string): RosePropertyDataBuilder {
        this._qualifierName = val;
        return this;
    }

    public setLazy(val: boolean): RosePropertyDataBuilder {
        this._isLazy = val;
        return this;
    }

    public get qualifierName(): string {
        return this._qualifierName;
    }

    public get isLazy(): boolean {
        return this._isLazy;
    }

    protected getThis(): RosePropertyDataBuilder {
        return this;
    }

    public build(): RosePropertyData {
        return new RosePropertyData(this);
    }

}