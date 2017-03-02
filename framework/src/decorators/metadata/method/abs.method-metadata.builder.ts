import {MetadataBuilder} from "../metadata.builder";
import {AbsMethodMetadata} from "./abs.method-metadata.bean";

export abstract class AbsMethodMetadataBuilder
<B extends AbsMethodMetadataBuilder<B, M>, M extends AbsMethodMetadata<B>> extends MetadataBuilder<B, M> {

    private _methodName: string;

    constructor(metadata?: M) {
        super(metadata);
        if (!!metadata) {
            this._methodName = metadata.methodName;
        }
    }

    public setMethodName(val: string): B {
        this._methodName = val;
        return this.getThis();
    }

    public get methodName(): string {
        return this._methodName;
    }
}