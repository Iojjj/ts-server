import {CreatableType} from "../../decorator-utils/types/creatable.type";

export class TransformerError extends Error {

    constructor(fromType: CreatableType | Function, toType: CreatableType | Function, reason?: string) {
        super(`Can't transform ${fromType.name} to ${toType.name}.${!!reason ? ` ${reason}` : ''}`);
    }
}