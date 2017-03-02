import {MethodMetadataBuilder} from "./method-metadata.builder";
import {AbsMethodMetadata} from "./abs.method-metadata.bean";

export class MethodMetadata extends AbsMethodMetadata<MethodMetadataBuilder> {

    constructor(builder: MethodMetadataBuilder) {
        super(builder);
    }

    public newBuilder(): MethodMetadataBuilder {
        return new MethodMetadataBuilder(this);
    }
}