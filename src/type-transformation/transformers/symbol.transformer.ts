import {isNumber, isString, isSymbol} from "util";
import {TransformerContext} from "../models/abs.type-transformer.context";
import {Transformer} from "./abs.transformer";

export class SymbolTransformer extends Transformer<symbol> {

    public transform(context: TransformerContext, plainObject: Object): symbol {
        if (isSymbol(plainObject)) {
            return plainObject as symbol;
        }
        if (isString(plainObject)) {
            return Symbol(plainObject as string);
        }
        if (isNumber(plainObject)) {
            return Symbol(plainObject as number);
        }
        return Transformer.onCantTransform(plainObject.constructor, Symbol);
    }
}