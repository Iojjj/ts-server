import {CreatableType} from "../../decorator-utils/types/creatable.type";
import {TransformerError} from "../errors/transformer.error";
import {TransformerContext} from "../models/abs.type-transformer.context";
import {TransformType} from "../models/transform-type";

export abstract class Transformer<T> {

    public abstract transform(context: TransformerContext, val: Object): T;
    public abstract transform(context: TransformerContext, val: Object, ...types: TransformType<any>[]): T;

    protected static onCantTransform(fromType: Function | CreatableType, toType: Function | CreatableType): never {
        throw new TransformerError(fromType, toType);
    }
}