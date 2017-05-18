import {Metadata} from "./abs.metadata.bean";
import {MethodMetadataBuilder} from "./abs.method-metadata.builder";

/**
 * Abstract metadata class for decorated methods of classes.
 * @param B class of builder that constructs new instances of current class
 */
export abstract class MethodMetadata<B extends MethodMetadataBuilder<B, MethodMetadata<B>>>
    extends Metadata<B> {

    /**
     * Name of decorated method.
     */
    public readonly methodName: string;

    constructor(builder: B) {
        super(builder);
        this.methodName = builder.methodName;
    }
}