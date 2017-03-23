import {Metadata} from "./abs.metadata.bean";
import {ParameterData} from "./abs.parameter-data.bean";
import {ParameterMetadataBuilder} from "./abs.parameter-metadata.builder";

/**
 * Abstract metadata class for decorated parameters of methods of classes.
 * @param B class of builder that constructs new instances of current class
 * @param P class of parameters data associated with current class
 */
export abstract class ParameterMetadata<B extends ParameterMetadataBuilder<B, ParameterMetadata<B, P>, P>,
    P extends ParameterData<any>>
    extends Metadata<B> {

    /**
     * Name of method decorated parameter should be passed to.
     */
    public readonly methodName: string;

    /**
     * Total number of arguments passed into method.
     */
    public readonly totalArgsCount: number;

    /**
     * Custom data for decorated parameter.
     */
    public readonly parameters: P[];

    constructor(builder: B) {
        super(builder);
        this.methodName = builder.methodName;
        this.totalArgsCount = builder.totalArgsCount;
        this.parameters = builder.parameters as P[];
    }
}