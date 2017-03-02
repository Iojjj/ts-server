import "reflect-metadata";
import {ModuleMetadata} from "../../metadata/module-metadata.bean";
import {Constants} from "../../constants";
import {ParameterMetadata} from "../../../decorators/metadata/parameter/parameter-metadata.bean";
import {AnyType} from "../../../decorators/type";
import {RoseParameterData} from "../../models/parameter-data.bean";
import {ProvidesMetadata} from "../../metadata/provides-metadata.bean";
import {InjectPropertyMetadata} from "../../metadata/inject-property-metadata.bean";

/**
 * Decorator that tells Rose to inject all required dependencies.
 * @param modules list of modules that provide dependencies
 */
export function Component(...modules: AnyType[]) {
    return function (target: Function) {
        const correctMetadata = checkModules(modules, target);
        const proto = target.prototype;
        defineInjector(proto, target.name, correctMetadata);

        // constructor params that must be injected
        const constructorMetadata = Reflect
            .getMetadata(Constants.METADATA_PARAMETER, target, Constants.CONSTRUCTOR) as ParameterMetadata;
        // params of methods that must be injected
        const injectParams = Object.keys(proto)
            .map(key => Reflect.getMetadata(Constants.METADATA_PARAMETER, proto, key) as ParameterMetadata)
            .filter(metadata => !!metadata);
        // properties that must be injected
        const injectProps = Reflect.getOwnMetadataKeys(proto)
            .filter(key => key.startsWith(Constants.METADATA_PROPERTY))
            .map(key => Reflect.getMetadata(key, proto) as InjectPropertyMetadata);
        // creating a new constructor

        const original = target;
        const newConstructor = function (...args: any[]) {
            // injecting params before calling object constructor
            if (!!constructorMetadata) {
                args = injectArguments(this, constructorMetadata, args);
            }
            injectParameters(this, injectParams);
            injectProperties(this, injectProps);
            return original.apply(this, args);
        };
        newConstructor.prototype = original.prototype;
        return <any>newConstructor;
    };
}

/**
 * Check modules and return tuple of module and its metadata.
 * @param modules list of modules
 * @param target class decorated with @Module
 * @return {ModuleMetadata[]} metadata of modules
 * @throws if one of the modules is undefined or not decorated with @Module
 */
function checkModules(modules: AnyType[], target: Function): ModuleMetadata[] {
    const undefinedModules = modules.filter(m => !m);
    if (undefinedModules.length > 0) {
        throw new Error(`${target.name}: some modules are not defined. It's possible that one of the modules has` +
            ` a circular dependency with current class marked with @Component.`);
    }
    const allModuleMetadata = modules
        .filter(m => !!m)
        .map(module => [module, Reflect.getMetadata(Constants.METADATA_MODULE, module) as ModuleMetadata]);

    // check non-modules
    const moduleMetadata = allModuleMetadata
        .filter(values => !values[1])
        .map(values => values[0] as AnyType);
    if (moduleMetadata.length > 0) {
        const invalidModules = moduleMetadata.map(m => m.name);
        throw new Error(`${target.name}: some of passed modules are not decorated with @Module decorator.` +
            ` These are: ${invalidModules.join(", ")}.`);
    }
    const correctMetadata = allModuleMetadata
        .filter(values => !!values[1])
        .map(values => values[1] as ModuleMetadata);
    if (correctMetadata.length === 0) {
        console.warn(`${target.name}: no modules provided. Maybe this is an error.`);
    }
    return correctMetadata;
}

/**
 * Inject methods' parameters.
 * @param instance instance of class
 * @param parameterMetadata injectable parameters metadata
 */
function injectParameters(instance: any, parameterMetadata: ParameterMetadata[]): void {
    parameterMetadata
        .forEach(metadata => {
            const origMethod = instance[metadata.methodName] as Function;
            const wrappedMethod = (...args: any[]) => {
                args = injectArguments(instance, metadata, args);
                return origMethod.apply(instance, args);
            };
            try {
                if (delete instance[metadata.methodName]) {
                    // change original method with new one that will inject parameters once it is called
                    Object.defineProperty(instance, metadata.methodName, {
                        value: wrappedMethod,
                        configurable: true,
                        enumerable: true
                    });
                    return;
                }
            } catch (error) {
                // strict mode
                console.error(error);
            }
            throw new Error(`${instance.name}: can't delete property ${metadata.methodName}.`);
        });
}

/**
 * Inject properties of instance.
 * @param instance instance of class
 * @param propMetadata injectable properties metadata
 */
function injectProperties(instance: any, propMetadata: InjectPropertyMetadata[]): void {
    propMetadata.forEach(m => {
        const metadata = m.propertyData;
        if (delete instance[metadata.propertyName]) {
            const injector = instance[Constants.PROPERTY_INJECTOR] as Injector;
            if (!injector) {
                throw new Error(`${m.targetName}: injector not found`);
            }
            if (metadata.isLazy) {
                // lazy loading.Inject value only when it's requested
                let value: any;
                Object.defineProperty(instance, metadata.propertyName, {
                    get: () => {
                        if (value === undefined) {
                            value = injector.inject(metadata.propertyName, metadata.type, metadata.qualifierName);
                        }
                        return value;
                    },
                    set: (val: any) => value = val,
                    configurable: true,
                    enumerable: true
                });
            } else {
                // inject value on object creation
                let value = injector.inject(metadata.propertyName, metadata.type, metadata.qualifierName);
                Object.defineProperty(Object.getPrototypeOf(instance), metadata.propertyName, {
                    get: () => value,
                    set: (val: any) => value = val,
                    configurable: true,
                    enumerable: true
                });
            }
        }
    });
}

/**
 * Inject arguments for single method.
 * @param instance instance of class
 * @param metadata injectable parameters metadata
 * @param args arguments passed to the method
 * @return {any[]} new arguments that also holds injected parameters
 */
function injectArguments(instance: any, metadata: ParameterMetadata, args: any[]): any[] {
    const injector = instance[Constants.PROPERTY_INJECTOR] as Injector;
    if (!injector) {
        throw new Error(`${instance.name}.${metadata.methodName}: injector not found.`);
    }
    const newArgs: any[] = [];
    for (let i = 0; i < metadata.totalArgsCount; i++) {
        const param = metadata.parameters.find(param => param.index === i) as RoseParameterData;
        if (!param) {
            newArgs[i] = args[i];
        } else {
            newArgs[i] = injector.inject(metadata.methodName, param.type, param.qualifierName);
        }
    }
    return newArgs;
}

/**
 * Define injector on instance.
 * @param proto prototype of class
 * @param targetName name of class decorated with @Component
 * @param metadata list of passed module metadata
 */
function defineInjector(proto: any, targetName: string, metadata: ModuleMetadata[]): void {
    if (proto.hasOwnProperty(Constants.PROPERTY_INJECTOR)) {
        delete proto[Constants.PROPERTY_INJECTOR];
    }
    const allProviders = metadata.map(m => m.providers)
        .reduce((all, single) => [...single, ...all], []);
    // define injector property that will inject all necessary dependencies
    Object.defineProperty(proto, Constants.PROPERTY_INJECTOR, {
        value: new Injector(targetName, allProviders),
        configurable: true,
        enumerable: true,
        writable: false
    });
}

/**
 * Throw an error if no provider found.
 * @param targetName name of class decorated with @Component
 * @param propertyName name of property that must be injected or method where parameters must be injected
 * @param type type of injectable property or parameter
 * @param qualifierName qualifier name of injectable property or parameter
 */
function onNothingFound(targetName: string, propertyName: string, type?: AnyType, qualifierName?: string): never {
    if (!!type && !!qualifierName) {
        throw new Error(`${targetName}.${propertyName}: can't find provider for type "${type.name}"` +
            ` and qualifier "${qualifierName}". Make sure you have declared a provider for type or with proper` +
            " qualifier name");
    }
    if (!!type) {
        throw new Error(`${targetName}.${propertyName}: can't find provider for type "${type.name}".` +
            ` Make sure you have declared a provider for type.`);
    }
    if (!!qualifierName) {
        throw new Error(`${targetName}.${propertyName}: can't find provider for qualifier "${qualifierName}".` +
            `Make sure you have declared a provider with proper qualifier name.`);
    }
    throw new Error(`${targetName}.${propertyName}: type and qualifier are not specified.`);
}

/**
 * Throw an error if there are multiple providers found.
 * @param targetName name of class decorated with @Component
 * @param propertyName name of property that must be injected or method where parameters must be injected
 * @param type type of injectable property or parameter
 * @param qualifierName qualifier name of injectable property or parameter
 */
function onCantChoose(targetName: string, propertyName: string, type?: AnyType, qualifierName?: string): never {
    if (!!type && !!qualifierName) {
        throw new Error(`${targetName}.${propertyName}: multiple instances of providers found for type "${type.name}"` +
            ` and qualifier "${qualifierName}".`);
    }
    if (!!type) {
        throw new Error(`${targetName}.${propertyName}: multiple instances of providers found for type "${type.name}".`
            + ` Try to use qualifier to specify proper provider.`);
    }
    if (!!qualifierName) {
        throw new Error(`${targetName}.${propertyName}: multiple instances of providers found for ` +
            `qualifier "${qualifierName}". Make sure you have declared proper combination of type and qualifier.`);
    }
    throw new Error(`${targetName}.${propertyName}: type and qualifier are not specified.`);
}

/**
 * Injector implementation.
 */
class Injector {

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
     * @param qualifierName qualifier for injectable property or parameter
     * @return {any} injected value
     */
    public inject(propertyName: string, type: AnyType, qualifierName: string = ""): any {
        let byQualifierName = false;
        let providers = this.allProviders.filter(m => m.type === type);
        if (providers.length === 0) {
            if (!!qualifierName) {
                providers = this.allProviders.filter(m => m.qualifierName === qualifierName);
            }
            byQualifierName = true;
        }

        if (providers.length === 0) {
            onNothingFound(this.targetName, propertyName, type, qualifierName);
        }

        if (providers.length > 1) {
            if (byQualifierName) {
                onCantChoose(this.targetName, propertyName, type, qualifierName);
            }
            providers = providers.filter(m => m.qualifierName === qualifierName);
        }

        if (providers.length === 0) {
            onNothingFound(this.targetName, propertyName, type, qualifierName);
        }
        if (providers.length > 1) {
            onCantChoose(this.targetName, propertyName, type, qualifierName);
        }
        return providers[0].method();
    }
}