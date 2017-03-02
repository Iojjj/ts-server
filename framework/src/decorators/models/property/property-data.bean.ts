import {PropertyDataBuilder} from "./property-data.builder";
import {AbsPropertyData} from "./abs.property-data.bean";

/**
 * Data related to decorated property.
 */
export class PropertyData extends AbsPropertyData<PropertyDataBuilder> {

    public newBuilder(): PropertyDataBuilder {
        return new PropertyDataBuilder(this);
    }
}