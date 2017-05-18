import {PropertyMetadataBuilder} from "../../public/decorator-utils/metadata/abs.property-metadata.builder";
import {TransformType} from "../../public/type-transformation/models/transform-type";
import {TypedMetadata} from "./typed-metadata.bean";

/**
 * @internal
 */
export class TypedMetadataBuilder extends PropertyMetadataBuilder<TypedMetadataBuilder, TypedMetadata> {

    private _convertableType: TransformType<any>;

    constructor(metadata?: TypedMetadata) {
        super(metadata);
        if (!!metadata) {
            this._convertableType = metadata.convertableType;
        }
    }

    public setConvertableType(val: TransformType<any>): TypedMetadataBuilder {
        this._convertableType = val;
        return this;
    }

    public get convertableType(): TransformType<any> {
        return this._convertableType;
    }

    protected getThis(): TypedMetadataBuilder {
        return this;
    }

    public build(): TypedMetadata {
        return new TypedMetadata(this);
    }

}