import {CreatableType} from "../../decorator-utils/types/creatable.type";
import {Component} from "../../di/decorators/class.component.decorator";
import {Inject} from "../../di/decorators/prop.inject.decorator";
import {TypeTransformerModule} from "../../../internal/type-transformation/type-transformer.module";
import {Transformer} from "../transformers/abs.transformer";
import {TypedClassTransformer} from "../transformers/typed-class.transformer";
import {TransformerContext} from "./abs.type-transformer.context";
import {TransformType} from "./transform-type";

@Component(TypeTransformerModule)
export class TypeTransformer implements TransformerContext {

    private readonly typesMap = new Map<CreatableType, Transformer<any>>();

    @Inject()
    private readonly typedTransformer: TypedClassTransformer;

    public registerTransformer(type: CreatableType, transformer: Transformer<any>): void {
        if (!!this.typesMap.get(type)) {
            throw new Error(`Transformer for type ${type.name} already registered.`);
        }
        this.typesMap.set(type, transformer);
    }

    public unregisterTransformer(type: CreatableType): void {
        this.typesMap.delete(type);
    }

    public transform<T>(val: any, type: CreatableType): T;
    public transform<T>(val: any, type: TransformType<T>): T;
    public transform<T>(val: any, inType: TransformType<T> | CreatableType): T {
        let type: TransformType<T>;
        if (inType instanceof TransformType) {
            type = inType;
        } else {
            type = TransformType.getType(inType);
        }
        if (TypeTransformer.shouldReturnDefaultValue(val)) {
            return type.defaultValue;
        }
        const transformer = this.typesMap.get(type.baseType);
        if (!!transformer) {
            return transformer.transform(this, val, ...type.parameters);
        }
        return this.typedTransformer.transform(this, val, type);
    }

    private static shouldReturnDefaultValue(val: any): boolean {
        return !val && (val === undefined || val == null);
    }
}