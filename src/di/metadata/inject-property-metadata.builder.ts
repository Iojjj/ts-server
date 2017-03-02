import {InjectPropertyMetadata} from "./inject-property-metadata.bean";
import {AbsPropertyMetadataBuilder} from "../../decorators/metadata/property/abs.property-metadata.builder";
import {RosePropertyData} from "../models/property-data.bean";

export class InjectPropertyMetadataBuilder extends
    AbsPropertyMetadataBuilder<InjectPropertyMetadataBuilder, InjectPropertyMetadata> {

    private _propertyData: RosePropertyData;

    constructor(metadata?: InjectPropertyMetadata) {
        super(metadata);
        if (!!metadata) {
            this._propertyData = metadata.propertyData;
        }
    }
    
    public setPropertyData(val: RosePropertyData): InjectPropertyMetadataBuilder {
        this._propertyData = val;
        return this;
    }

    public get propertyData(): RosePropertyData {
        return this._propertyData;
    }

    protected getThis(): InjectPropertyMetadataBuilder {
        return this;
    }

    public build(): InjectPropertyMetadata {
        return new InjectPropertyMetadata(this);
    }

}