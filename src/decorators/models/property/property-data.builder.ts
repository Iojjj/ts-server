import {PropertyData} from "./property-data.bean";
import {AbsPropertyDataBuilder} from "./abs.property-data.builder";

export class PropertyDataBuilder extends AbsPropertyDataBuilder<PropertyDataBuilder, PropertyData> {

    protected getThis(): PropertyDataBuilder {
        return this;
    }

    public build(): PropertyData {
        return new PropertyData(this);
    }

}