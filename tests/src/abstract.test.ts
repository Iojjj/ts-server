import {TypeTransformer} from "../../framework/src/type-transformer/type.transformer";
import {Test} from "./test";

export abstract class AbstractTest implements Test {

    public abstract run(typeTransformer?: TypeTransformer): void;
}