import {MetadataBuilder} from "./abs.metadata.builder";
import {ParameterData} from "./abs.parameter-data.bean";
import {ParameterMetadata} from "./abs.parameter-metadata.bean";

/**
 * Abstract builder for metadata of decorated parameters.
 * @param B class of builder that inherits from current class
 * @param M class of metadata associated with builder class
 * @param P class of parameters data associated with metadata class
 */
export abstract class ParameterMetadataBuilder
<B extends ParameterMetadataBuilder<B, M, P>, M extends ParameterMetadata<B, P>, P extends ParameterData<any>>
    extends MetadataBuilder<B, M> {

    private _methodName?: string;
    private _totalArgsCount?: number;
    private readonly _parameters: P[];

    constructor(metadata?: M) {
        super(metadata);
        if (!!metadata) {
            this._methodName = metadata.methodName;
            this._totalArgsCount = metadata.totalArgsCount;
            this._parameters = metadata.parameters ? Array.from<P>(metadata.parameters) : [];
        } else {
            this._parameters = [];
        }
    }

    //noinspection JSValidateJSDoc
    /**
     * Set name of method decorated parameter should be passed to.
     * @param val name of method
     * @return {B} instance of current builder
     */
    public setMethodName(val: string): B {
        this._methodName = val;
        return this.getThis();
    }

    //noinspection JSValidateJSDoc
    /**
     * Set total number of arguments passed into method.
     * @param val total number of arguments
     * @return {B} instance of current builder
     */
    public setTotalArgsCount(val: number): B {
        this._totalArgsCount = val;
        return this.getThis();
    }

    //noinspection JSValidateJSDoc
    /**
     * Add data related to parameter.
     * @param val data related to parameter
     * @return {B} instance of current builder
     */
    public addParameter(val: P): B {
        this._parameters.push(val);
        return this.getThis();
    }

    //noinspection JSValidateJSDoc,JSUnusedGlobalSymbols
    /**
     * Remove data related to parameter.
     * @param val data related to parameter
     * @return {B} instance of current builder
     */
    public removeParameter(val: P): B {
        const index = this._parameters.indexOf(val);
        if (index > -1) {
            this._parameters.splice(index, 1);
        }
        return this.getThis();
    }

    //noinspection JSValidateJSDoc,JSUnusedGlobalSymbols
    /**
     * Clear all data related to parameters.
     * @return {B} instance of current builder
     */
    public clearParameters(): B {
        this._parameters.splice(0);
        return this.getThis();
    }

    /**
     * Name of method decorated parameter should be passed to.
     */
    public get methodName(): string {
        return this._methodName || "";
    }

    /**
     * Total number of arguments passed into method.
     */
    public get totalArgsCount(): number {
        return this._totalArgsCount || 0;
    }

    /**
     * Custom data for decorated parameter.
     */
    public get parameters(): P[] {
        return Array.from<P>(this._parameters);
    }
}