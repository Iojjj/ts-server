import {BeanBuilder} from "../../common/beans/abs.bean.builder";
import {Metadata} from "./abs.metadata.bean";

/**
 * Abstract builder for metadata.
 * @param B class of builder that inherits from current class
 * @param M class of metadata associated with builder class
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

    //noinspection JSValidateJSDoc
    /**
     * Set name of decorated class.
     * @param val name of decorated class
     * @return {B} instance of current builder
     */
    public setTargetName(val: string): B {
        this._targetName = val;
        return this.getThis();
    }

    /**
     * Name of decorated class.
     */
    public get targetName(): string {
        return this._targetName || "";
    }
}