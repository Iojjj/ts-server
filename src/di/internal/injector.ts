import {CreatableType} from "../../decorator-utils/types/creatable.type";
import {ProvidesMetadata} from "../metadata/provides-metadata.bean";
import {Provider} from "../models/abs.provider";
import {AnyProvider} from "./any.provider.impl";

/**
 * Implementation of class that stores list of providers of dependencies.
 * @internal
 */
export class Injector {

    private allProviders: ProvidesMetadata[];
    private targetName: string;

    constructor(targetName: string, allProviders: ProvidesMetadata[]) {
        this.allProviders = allProviders;
        this.targetName = targetName;
    }

    /**
     * Inject a property or parameter.
     * @param propertyName property or method name
     * @param type type of injectable property or parameter
     * @param qualifier qualifier for injectable property or parameter
     * @return {any} injected value
     */
    public inject(propertyName: string, type: CreatableType | undefined, qualifier: string
                      | CreatableType
                      | undefined): any {
        let isProvider = false;
        if (type === Provider) {
            isProvider = true;
            if (!qualifier) {
                throw new Error(`${this.targetName}.${propertyName}: you need to specify a qualifier when injecting a `
                    + "provider.");
            }
            type = undefined;
        }
        if (typeof qualifier === "function") {
            // set proper type for searching
            type = qualifier;
            qualifier = undefined;
        }
        let providers: ProvidesMetadata[] = [];
        let byQualifier = false;
        if (!!qualifier) {
            // qualifier must be a string only
            providers = this.allProviders.filter(m => typeof m.qualifier === "string" && m.qualifier === qualifier);
            byQualifier = true;
        } else if (!!type) {
            providers = this.allProviders.filter(m => m.type === type);
        }

        if (providers.length === 0) {
            Injector.onNothingFound(this.targetName, propertyName, type, qualifier, byQualifier);
        }
        if (providers.length > 1) {
            Injector.onCantChoose(this.targetName, propertyName, type, qualifier, byQualifier);
        }

        const provider = providers[0];
        const method = provider.method;
        if (!method) {
            throw new Error(`${provider.targetName}.${provider.methodName}: provider method is not defined.`);
        }
        if (isProvider) {
            return AnyProvider.from(method);
        }
        return method();
    }

    /**
     * Throw an error if no provider found.
     * @param targetName name of class decorated with @Component
     * @param propertyName name of property that must be injected or method where parameters must be injected
     * @param type type of injectable property or parameter
     * @param qualifierName qualifier name of injectable property or parameter
     * @param byQualifier true if providers not found after search by qualifier, false otherwise
     */
    private static onNothingFound(targetName: string, propertyName: string,
                                  type?: CreatableType, qualifierName?: string, byQualifier = false): never {
        if (byQualifier && !!qualifierName) {
            throw new Error(`${targetName}.${propertyName}: can't find provider for qualifier "${qualifierName}". ` +
                `Make sure you have declared a provider with proper qualifier name.`);
        }
        if (!!type) {
            throw new Error(`${targetName}.${propertyName}: can't find provider for type "${type.name}".` +
                ` Make sure you have declared a provider for type.`);
        }
        throw new Error(`${targetName}.${propertyName}: type and qualifier are not specified.`);
    }

    /**
     * Throw an error if there are multiple providers found.
     * @param targetName name of class decorated with @Component
     * @param propertyName name of property that must be injected or method where parameters must be injected
     * @param type type of injectable property or parameter
     * @param qualifierName qualifier name of injectable property or parameter
     * @param byQualifier true if providers not found after search by qualifier, false otherwise
     */
    private static onCantChoose(targetName: string, propertyName: string, type?: CreatableType, qualifierName?: string,
                                byQualifier = false): never {
        if (byQualifier && !!qualifierName) {
            throw new Error(`${targetName}.${propertyName}: multiple instances of providers found for ` +
                `qualifier "${qualifierName}". Make sure you have declared proper combination of type and qualifier.`);
        }
        if (!!type) {
            throw new Error(`${targetName}.${propertyName}: multiple instances of providers found for type ` +
                `"${type.name}". Try to use qualifier to specify proper provider.`);
        }
        throw new Error(`${targetName}.${propertyName}: type and qualifier are not specified.`);
    }
}