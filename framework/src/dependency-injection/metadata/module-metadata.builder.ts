import {ModuleMetadata} from "./module-metadata.bean";
import {MetadataBuilder} from "../../decorators/metadata/metadata.builder";
import {ProvidesMetadata} from "./provides-metadata.bean";

/**
 * Builder for a module metadata.
 */
export class ModuleMetadataBuilder extends MetadataBuilder<ModuleMetadataBuilder, ModuleMetadata> {

    private _providers: ProvidesMetadata[];

    constructor(metadata?: ModuleMetadata) {
        super(metadata);
        if (!!metadata) {
            this._providers = metadata.providers ? Array.from(metadata.providers) : [];
        }
    }

    /**
     * Set list of providers.
     * @param val list of providers
     */
    public setProviders(val: ProvidesMetadata[]): ModuleMetadataBuilder {
        this._providers = val;
        return this;
    }

    public get providers(): ProvidesMetadata[] {
        return this._providers;
    }

    protected getThis(): ModuleMetadataBuilder {
        return this;
    }

    public build(): ModuleMetadata {
        return new ModuleMetadata(this);
    }

}