import {Metadata} from "../../../decorator-utils/metadata/abs.metadata.bean";
import {ModuleMetadataBuilder} from "./module-metadata.builder";
import {ProvidesMetadata} from "./provides-metadata.bean";

/**
 * Metadata for {@link Module} decorator. It allows to store list of providers of this module.
 */
export class ModuleMetadata extends Metadata<ModuleMetadataBuilder> {

    /**
     * List of providers of this module.
     * @return {ProvidesMetadata[]} list of providers
     */
    public readonly providers: ProvidesMetadata[];

    constructor(builder: ModuleMetadataBuilder) {
        super(builder);
        this.providers = builder.providers;
    }

    public newBuilder(): ModuleMetadataBuilder {
        return new ModuleMetadataBuilder(this);
    }
}