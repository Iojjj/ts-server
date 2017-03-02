import {RosePropertyData} from "../models/property-data.bean";
import {InjectPropertyMetadataBuilder} from "./inject-property-metadata.builder";
import {AbsPropertyMetadata} from "../../decorators/metadata/property/abs.property-metadata.bean";

export class InjectPropertyMetadata extends AbsPropertyMetadata<InjectPropertyMetadataBuilder> {

    public readonly propertyData: RosePropertyData;

    constructor(builder: InjectPropertyMetadataBuilder) {
        super(builder);
        this.propertyData = builder.propertyData;
    }

    public newBuilder(): InjectPropertyMetadataBuilder {
        return new InjectPropertyMetadataBuilder(this);
    }

}