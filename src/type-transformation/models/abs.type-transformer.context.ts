import {CreatableType} from "../../decorator-utils/types/creatable.type";
import {Transformer} from "../transformers/abs.transformer";
import {TransformType} from "./transform-type";

export abstract class TransformerContext {

    public abstract registerTransformer(type: CreatableType, transformer: Transformer<any>): void;

    public abstract unregisterTransformer(type: CreatableType): void;

    public abstract transform<T>(val: any, type: TransformType<T>): T;
}