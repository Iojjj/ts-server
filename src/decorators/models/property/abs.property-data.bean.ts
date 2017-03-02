import {AbsPropertyDataBuilder} from "./abs.property-data.builder";
import {Bean} from "../../../common/bean";
import {AnyType} from "../../type";

/**
 * Data related to decorated property.
 */
export abstract class AbsPropertyData<B extends AbsPropertyDataBuilder<B, AbsPropertyData<B>>> extends Bean<B> {

    /**
     * Type of property.
     */
    public readonly type: AnyType;

    /**
     * Name of property.
     */
    public readonly propertyName: string;

    constructor(builder: B) {
        super(builder);
        this.propertyName = builder.propertyName;
        this.type = builder.type;
    }
}