import {RoseParameterData} from "./parameter-data.bean";
import {AbsParameterDataBuilder} from "../../decorators/models/parameter/abs.parameter-data.builder";

export class RoseParameterDataBuilder extends AbsParameterDataBuilder<RoseParameterDataBuilder, RoseParameterData> {

    private _qualifierName: string;

    constructor(model?: RoseParameterData) {
        super(model);
        if (!!model) {
            this._qualifierName = model.qualifierName;
        }
    }

    public setQualifierName(val: string): RoseParameterDataBuilder {
        this._qualifierName = val;
        return this;
    }

    public get qualifierName(): string {
        return this._qualifierName;
    }

    protected getThis(): RoseParameterDataBuilder {
        return this;
    }

    public build(): RoseParameterData {
        return new RoseParameterData(this);
    }

}