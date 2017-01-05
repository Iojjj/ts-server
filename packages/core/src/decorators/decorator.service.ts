/**
 * Abstract decorator service.
 */
export abstract class AbstractDecoratorService {

    private readonly _metadataKey: string;

    constructor(metadataKey: string) {
        this._metadataKey = metadataKey;
    }

    /**
     * Metadata key for this service.
     * @return {string} metadata key
     */
    protected get metadataKey(): string {
        return this._metadataKey;
    }
}