import {ProvidesMetadata} from "./provides-metadata.bean";
import {AbsMethodMetadataBuilder} from "../../decorators/metadata/method/abs.method-metadata.builder";
import {AnyType} from "../../decorators/type";

export class ProvidesMetadataBuilder extends AbsMethodMetadataBuilder<ProvidesMetadataBuilder, ProvidesMetadata> {

    private _type: AnyType;
    private _qualifierName: string;
    private _method: Function;
    private _isSingleton: boolean;

    constructor(metadata?: ProvidesMetadata) {
        super(metadata);
        if (!!metadata) {
            this._type = metadata.type;
            this._qualifierName = metadata.qualifierName;
            this._method = metadata.method;
            this._isSingleton = metadata.isSingleton;
        }
    }

    public setType(val: AnyType): ProvidesMetadataBuilder {
        this._type = val;
        return this;
    }

    public setQualifierName(val: string): ProvidesMetadataBuilder {
        this._qualifierName = val;
        return this;
    }

    public setMethod(val: Function): ProvidesMetadataBuilder {
        this._method = val;
        return this;
    }

    public setSingleton(val: boolean): ProvidesMetadataBuilder {
        this._isSingleton = val;
        return this;
    }

    public get type(): AnyType {
        return this._type;
    }

    public get qualifierName(): string {
        return this._qualifierName;
    }

    public get method(): Function {
        return this._method;
    }

    public get isSingleton(): boolean {
        return this._isSingleton;
    }

    protected getThis(): ProvidesMetadataBuilder {
        return this;
    }

    public build(): ProvidesMetadata {
        return new ProvidesMetadata(this);
    }

}