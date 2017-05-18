import {Provider} from "../../../../public/di/models/abs.provider";
import {InjectPropertyMetadata} from "../../metadata/inject-property-metadata.bean";
import {ProvidesMetadata} from "../../metadata/provides-metadata.bean";
import {Injector} from "./abs.injector";

export abstract class ProvidersInjector<T> extends Injector {

    private readonly byTypes: Map<Function, T>;
    private readonly byQualifiers: Map<symbol, T>;

    private readonly registeredTypes: Set<Function>;
    private readonly registeredQualifiers: Set<symbol>;

    constructor() {
        super();
        this.byTypes = new Map();
        this.byQualifiers = new Map();
        this.registeredTypes = new Set();
        this.registeredQualifiers = new Set();
    }

    public registerProviderByType(p: ProvidesMetadata, provider: T): void {
        if (!p.type) {
            throw new Error(); // will not be called
        }
        if (this.registeredTypes.has(p.type)) {
            throw new Error(`${p.targetName}.${p.methodName}: provider for type "${p.type}" already registered.`);
        }
        this.registeredTypes.add(p.type);
        this.byTypes.set(p.type, provider);
    }

    public registerProviderByQualifier(p: ProvidesMetadata, provider: T): void {
        if (!p.qualifier) {
            throw new Error(); // will not be called
        }
        if (this.registeredQualifiers.has(p.qualifier)) {
            throw new Error(`${p.targetName}.${p.methodName}: duplicate qualifier "${Symbol.keyFor(p.qualifier)}".`);
        }
        this.registeredQualifiers.add(p.qualifier);
        this.byQualifiers.set(p.qualifier, provider);
    }

    public canInject(metadata: InjectPropertyMetadata): boolean {
        const qualifier = metadata.qualifier;
        const type = metadata.type;
        if (!type && !qualifier) {
            return false;
        }
        ProvidersInjector.checkProviderAndThrow(metadata);
        return !!type && this.byTypes.has(type) || !!qualifier && this.byQualifiers.has(qualifier);
    }

    protected getProvider(metadata: InjectPropertyMetadata): T | undefined {
        const qualifier = metadata.qualifier;
        const type = metadata.type;
        if (!type && !qualifier) {
            throw new Error(`${metadata.targetName}.${metadata.propertyName}: specify type or qualifier.`);
        }
        ProvidersInjector.checkProviderAndThrow(metadata);
        let provider: T | undefined;
        if (!!qualifier) {
            provider = this.byQualifiers.get(qualifier);
        } else if (!!type) {
            provider = this.byTypes.get(type);
        }
        return provider;
    }

    private static checkProviderAndThrow(metadata: InjectPropertyMetadata): void {
        if (metadata.type === Provider && !metadata.qualifier) {
            throw new Error(`${metadata.targetName}.${metadata.propertyName}: you must specify qualifier for `
                + `"${Provider.name}" type.`);
        }
    }
}