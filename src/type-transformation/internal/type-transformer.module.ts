import {CreatableType} from "../../decorator-utils/types/creatable.type";
import {Module} from "../../di/decorators/class.module.decorator";
import {Provides} from "../../di/decorators/method.provides.decorator";
import {Transformer} from "../transformers/abs.transformer";
import {ArrayTransformer} from "../transformers/array.transformer";
import {BooleanTransformer} from "../transformers/boolean.transformer";
import {BufferTransformer} from "../transformers/buffer.transformer";
import {DateTransformer} from "../transformers/date.transformer";
import {MapTransformer} from "../transformers/map.transformer";
import {NumberTransformer} from "../transformers/number.transformer";
import {SetTransformer} from "../transformers/set.transformer";
import {StringTransformer} from "../transformers/string.transformer";
import {SymbolTransformer} from "../transformers/symbol.transformer";
import {TypedClassTransformer} from "../transformers/typed-class.transformer";

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