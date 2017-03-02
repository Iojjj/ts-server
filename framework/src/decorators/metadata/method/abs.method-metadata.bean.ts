import {Metadata} from "../metadata";
import {AbsMethodMetadataBuilder} from "./abs.method-metadata.builder";

export abstract class AbsMethodMetadata<B extends AbsMethodMetadataBuilder<B, AbsMethodMetadata<B>>>
extends Metadata<B> {

    public readonly methodName: string;

    constructor(builder: B) {
        super(builder);
        this.methodName = builder.methodName;
    }
}