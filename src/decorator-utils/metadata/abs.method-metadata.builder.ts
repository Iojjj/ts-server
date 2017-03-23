import {MetadataBuilder} from "./abs.metadata.builder";
import {MethodMetadata} from "./abs.method-metadata.bean";

/**
 * Abstract builder for metadata of decorated methods.
 * @param B class of builder that inherits from current class
 * @param M class of metadata associated with builder class
 */
export abstract class MethodMetadataBuilder<B extends MethodMetadataBuilder<B, M>, M extends MethodMetadata<B>>
    extends MetadataBuilder<B, M> {

    private _methodName: string;

    constructor(metadata?: M) {
        super(metadata);
        if (!!metadata) {
            this._methodName = metadata.methodName;
        }
    }

    //noinspection JSValidateJSDoc
    /**
     * Set name of decorated method.
     * @param val name of decorated method
     * @return {B} instance of current builder
     */
    public setMethodName(val: string): B {
        this._methodName = val;
        return this.getThis();
    }

    /**
     * Name of decorated method.
     */
    public get methodName(): string {
        return this._methodName || "";
    }
}