import {MethodMetadata} from "./method-metadata.bean";
import {AbsMethodMetadataBuilder} from "./abs.method-metadata.builder";

export class MethodMetadataBuilder extends AbsMethodMetadataBuilder<MethodMetadataBuilder, MethodMetadata> {

    protected getThis(): MethodMetadataBuilder {
        return this;
    }

    public build(): MethodMetadata {
        return new MethodMetadata(this);
    }
}