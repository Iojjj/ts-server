import {Metadata} from "../../decorators/metadata/metadata";
import {ModuleMetadataBuilder} from "./module-metadata.builder";
import {PropertyMetadata} from "../../decorators/metadata/property/property-metadata.bean";
import {ProvidesMetadata} from "./provides-metadata.bean";

/**
 * Metadata for {@link Module} decorator. It allows to store list of providers of this module.
 */
export class ModuleMetadata extends Metadata<ModuleMetadataBuilder> {

    /**
     * List of providers of this module.
     * @return {PropertyMetadata[]} list of providers
     */
    public readonly providers: ProvidesMetadata[];

    constructor(builder: ModuleMetadataBuilder) {
        super(builder);
        this.providers = builder.providers ? Array.from(builder.providers) : [];
    }

    public newBuilder(): ModuleMetadataBuilder {
        return new ModuleMetadataBuilder(this);
    }
}