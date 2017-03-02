import {Metadata} from "./metadata";
import {BeanBuilder} from "../../common/bean.builder";

/**
 * Abstract builder for metadata.
 */
export abstract class MetadataBuilder<B extends MetadataBuilder<B, M>, M extends Metadata<B>>
extends BeanBuilder<B, M> {

    private _targetName: string;

    constructor(metadata?: M) {
        super(metadata);
        if (!!metadata) {
            this._targetName = metadata.targetName;
        }
    }

    public setTargetName(val: string): B {
        this._targetName = val;
        return this.getThis();
    }

    public get targetName(): string {
        return this._targetName;
    }
}