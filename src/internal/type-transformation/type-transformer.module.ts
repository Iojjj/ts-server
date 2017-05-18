import {CreatableType} from "../../public/decorator-utils/types/creatable.type";
import {Module} from "../../public/di/decorators/class.module.decorator";
import {Provides} from "../../public/di/decorators/method.provides.decorator";
import {Transformer} from "../../public/type-transformation/transformers/abs.transformer";
import {ArrayTransformer} from "../../public/type-transformation/transformers/array.transformer";
import {BooleanTransformer} from "../../public/type-transformation/transformers/boolean.transformer";
import {BufferTransformer} from "../../public/type-transformation/transformers/buffer.transformer";
import {DateTransformer} from "../../public/type-transformation/transformers/date.transformer";
import {MapTransformer} from "../../public/type-transformation/transformers/map.transformer";
import {NumberTransformer} from "../../public/type-transformation/transformers/number.transformer";
import {SetTransformer} from "../../public/type-transformation/transformers/set.transformer";
import {StringTransformer} from "../../public/type-transformation/transformers/string.transformer";
import {SymbolTransformer} from "../../public/type-transformation/transformers/symbol.transformer";
import {TypedClassTransformer} from "../../public/type-transformation/transformers/typed-class.transformer";

/**
 * @internal
 */
@Module()
export class TypeTransformerModule {

    //noinspection JSUnusedGlobalSymbols
    @Provides("type.transformers")
    public static provideTransformers(): [CreatableType, Transformer<any>][] {
        return [
            [String, new StringTransformer()],
            [Symbol, new SymbolTransformer()],
            [Number, new NumberTransformer()],
            [Date, new DateTransformer()],
            [Boolean, new BooleanTransformer()],
            [Buffer, new BufferTransformer()],
            [Array, new ArrayTransformer()],
            [Set, new SetTransformer()],
            [Map, new MapTransformer()],
        ];
    }

    //noinspection JSUnusedGlobalSymbols
    @Provides()
    public static provideTypedClassTransformer(): TypedClassTransformer {
        return new TypedClassTransformer();
    }

    //noinspection JSUnusedLocalSymbols
    private constructor() {

    }
}