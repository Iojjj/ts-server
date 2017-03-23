import {CreatableType} from "../../decorator-utils/types/creatable.type";
import {Component} from "../../di/decorators/class.component.decorator";
import {Inject} from "../../di/decorators/prop.inject.decorator";
import {Named} from "../../di/decorators/prop.named.decorator";
import {TypeTransformerModule} from "../internal/type-transformer.module";
import {Transformer} from "../transformers/abs.transformer";
import {TypeTransformer} from "./type-transformer";

@Component(TypeTransformerModule)
export class DefaultTypeTransformer extends TypeTransformer {

    //noinspection JSMismatchedCollectionQueryUpdate
    @Inject() @Named("type.transformers")
    private readonly transformers: [CreatableType, Transformer<any>][];

    constructor() {
        super();
        this.transformers.forEach(values => this.registerTransformer(values[0], values[1]));
    }
}