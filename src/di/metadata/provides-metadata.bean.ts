import {ProvidesMetadataBuilder} from "./provides-metadata.builder";
import {AbsMethodMetadata} from "../../decorators/metadata/method/abs.method-metadata.bean";
import {AnyType} from "../../decorators/type";

export class ProvidesMetadata extends AbsMethodMetadata<ProvidesMetadataBuilder> {

    public readonly type: AnyType;
    public readonly qualifierName: string;
    public readonly method: Function;
    public readonly isSingleton: boolean;

    constructor(builder: ProvidesMetadataBuilder) {
        super(builder);
        this.type = builder.type;
        this.qualifierName = builder.qualifierName;
        this.method = builder.method;
        this.isSingleton = builder.isSingleton;
    }

    public newBuilder(): ProvidesMetadataBuilder {
        return new ProvidesMetadataBuilder(this);
    }

}