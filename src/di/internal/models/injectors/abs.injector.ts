import {InjectPropertyMetadata} from "../../metadata/inject-property-metadata.bean";

export abstract class Injector {

    protected static onNoProviderFound(metadata: InjectPropertyMetadata): never {
        const qualifier = metadata.qualifier;
        const type = metadata.type;
        if (!type && !qualifier) {
            throw new Error(`${metadata.targetName}.${metadata.propertyName}: specify type or qualifier.`);
        }
        console.log(metadata);
        throw new Error(`${metadata.targetName}.${metadata.propertyName}: no provider found ` +
            (qualifier ? `for qualifier "${Symbol.keyFor(qualifier)}"` :
                (type ? `for type "${type.name}"` : "")) +
            ` in scope "${Symbol.keyFor(metadata.scope)}".`);
    }

    public abstract canInject(metadata: InjectPropertyMetadata): boolean;

    public abstract inject(metadata: InjectPropertyMetadata): any;
}