import {MetadataBuilder} from "./metadata.builder";
import {Bean} from "../../common/bean";

/**
 * Abstract metadata class.
 */
export abstract class Metadata<B extends MetadataBuilder<B, Metadata<B>>> extends Bean<B> {

    /**
     * Name of class that decorated or contains decorated properties, methods or methods' parameters.
     */
    public readonly targetName: string;

    constructor(builder: B) {
        super(builder);
        this.targetName = builder.targetName;
    }
}