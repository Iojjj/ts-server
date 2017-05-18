import {Bean} from "../../common/beans/abs.bean";
import {MetadataBuilder} from "./abs.metadata.builder";

/**
 * Abstract metadata class that holds all necessary data about decorated objects.
 * @param B class of builder that constructs new instances of current class
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