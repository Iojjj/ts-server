import {MethodMetadata} from "../../../decorator-utils/metadata/abs.method-metadata.bean";
import {CreatableType} from "../../../decorator-utils/types/creatable.type";
import {ProvidesMetadataBuilder} from "./provides-metadata.builder";

/**
 * Metadata for {@link Provides} decorator.
 */
export class ProvidesMetadata extends MethodMetadata<ProvidesMetadataBuilder> {

    public readonly type: CreatableType;
    public readonly qualifier?: symbol;
    public readonly method?: Function;
    public readonly scope: symbol;

    constructor(builder: ProvidesMetadataBuilder) {
        super(builder);
        this.type = builder.type;
        this.qualifier = builder.qualifier;
        this.method = builder.method;
        this.scope = builder.scope;
    }

    public newBuilder(): ProvidesMetadataBuilder {
        return new ProvidesMetadataBuilder(this);
    }

}