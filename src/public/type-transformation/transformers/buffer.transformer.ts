import {isBuffer, isNumber, isString} from "util";
import {TransformerContext} from "../models/abs.type-transformer.context";
import {Transformer} from "./abs.transformer";

export class BufferTransformer extends Transformer<Buffer> {

    public transform(context: TransformerContext, plainObject: Object): Buffer {
        if (isBuffer(plainObject)) {
            return plainObject as Buffer;
        }
        if (isString(plainObject) || isNumber(plainObject)) {
            const val = String(plainObject);
            return new Buffer(val);
        }
        return Transformer.onCantTransform(plainObject.constructor, Buffer);
    }
}