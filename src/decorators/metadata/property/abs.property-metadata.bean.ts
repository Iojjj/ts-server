import {Metadata} from "../metadata";
import {AbsPropertyMetadataBuilder} from "./abs.property-metadata.builder";

export abstract class AbsPropertyMetadata<B extends AbsPropertyMetadataBuilder<B, AbsPropertyMetadata<B>>>
extends Metadata<B> {

    public readonly propertyName: string;

    constructor(builder: B) {
        super(builder);
        this.propertyName = builder.propertyName;
    }
}