import {AbsParameterMetadataBuilder} from "./abs.parameter-metadata.builder";
import {Metadata} from "../metadata";
import {AbsParameterData} from "../../models/parameter/abs.parameter-data.bean";

export abstract class AbsParameterMetadata<B extends AbsParameterMetadataBuilder<B, AbsParameterMetadata<B>>>
extends Metadata<B> {

    public readonly methodName: string;
    public readonly totalArgsCount: number;
    public readonly parameters: AbsParameterData<any>[];

    constructor(builder: B) {
        super(builder);
        this.methodName = builder.methodName;
        this.totalArgsCount = builder.totalArgsCount;
        this.parameters = builder.parameters ? Array.from(builder.parameters) : [];
    }
}