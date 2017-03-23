import "reflect-metadata";
import {InjectPropertyMetadata} from "../metadata/inject-property-metadata.bean";
import {InjectPropertyMetadataBuilder} from "../metadata/inject-property-metadata.builder";
import {ModuleMetadata} from "../metadata/module-metadata.bean";
import {ModuleMetadataBuilder} from "../metadata/module-metadata.builder";
import {ProvidesMetadata} from "../metadata/provides-metadata.bean";
import {ProvidesMetadataBuilder} from "../metadata/provides-metadata.builder";
import {Injector} from "./injector";
import {PropertyInjector} from "./property.injector";

/**
 * Utils that helps to decorate classes, methods and properties.
 * @internal
 */
export class DecoratorUtils {

    private static readonly METADATA_MODULE = `__module__`;
    private static readonly METADATA_MODULE_PROVIDES = `__provides__`;
    private static readonly PROPERTY_INJECTOR = `__injector__`;

    private static getPropertyMetadataKey(propertyName: string): string {
        return `__property_${propertyName}__`;
    }

    /**
     * Update property decorator metadata.
     * @param target class that contains @Inject decorator
     * @param propertyName name of decorated property
     * @param update function that will updated metadata
     */
    public static updatePropertyMetadata(target: any, propertyName: string,
                                         update: (metadata: InjectPropertyMetadata) => InjectPropertyMetadata): void {
        const key = DecoratorUtils.getPropertyMetadataKey(propertyName);
        let metadata = Reflect.getMetadata(key, target) as InjectPropertyMetadata | undefined;
        if (!metadata) {
            metadata = new InjectPropertyMetadataBuilder()
                .setTargetName(target.constructor.name)
                .setPropertyName(propertyName)
                .build();
        }
        metadata = update(metadata);
        Reflect.defineMetadata(key, metadata, target);
    }

    /**
     * Update provider decorator metadata.
     * @param target class that contains @Provides decorator
     * @param methodName name of decorated method
     * @param update function that will updated metadata
     */
    public static updateProviderMetadata(target: Function, methodName: string,
                                         update: (metadata: ProvidesMetadata) => ProvidesMetadata): void {
        let metadata = Reflect
            .getMetadata(DecoratorUtils.METADATA_MODULE_PROVIDES, target, methodName) as ProvidesMetadata | undefined;
        if (!metadata) {
            metadata = new ProvidesMetadataBuilder()
                .setTargetName(target.name)
                .setMethodName(methodName)
                .build();
        }
        metadata = update(metadata);
        Reflect.defineMetadata(DecoratorUtils.METADATA_MODULE_PROVIDES, metadata, target, methodName);
    }

    /**
     * Set module decorator metadata.
     * @param target class that decorated with @Module decorator
     */
    public static decorateModule(target: Function): void {
        const providers = Object.keys(target)
            .map(key => Reflect.getMetadata(DecoratorUtils.METADATA_MODULE_PROVIDES, target, key) as ProvidesMetadata)
            .filter(m => !!m)
            .map(m => {
                if (!m.method) {
                    throw new Error(`${m.targetName}.${m.methodName}: provider method not defined.`);
                }
                if (m.isSingleton) {
                    const method = DecoratorUtils.wrapSingleton(m.method);
                    m = m.newBuilder()
                        .setMethod(method)
                        .build();
                }
                return m;
            });
        const metadata = new ModuleMetadataBuilder()
            .setTargetName(target.name)
            .setProviders(providers)
            .build();
        Reflect.defineMetadata(DecoratorUtils.METADATA_MODULE, metadata, target);
    }

    /**
     * Wrap function so now it will return a single instance of value.
     * @param f any function that returns a value
     * @return {()=>any} new function that returns a single instance of object
     */
    private static wrapSingleton(f: Function): Function {
        let value: any;
        return () => {
            if (value === undefined) {
                value = f();
            }
            return value;
        };
    }

    /**
     * Define injector for specified class.
     * @param target class that decorated with @Component decorator
     * @param modules list of modules
     */
    public static defineInjector(target: Function, modules: Function[]): void {
        const proto = target.prototype;
        // properties that must be injected
        const injectProps = Reflect.getOwnMetadataKeys(proto)
            .filter(key => key.startsWith("__property_"))
            .map(key => Reflect.getMetadata(key, proto) as InjectPropertyMetadata);
        // creating a new constructor
        const correctMetadata = DecoratorUtils.checkModules(modules, target);
        const allProviders = correctMetadata.map(m => m.providers)
            .reduce((all, single) => [...single, ...all], []);
        // define injector property that will inject all necessary dependencies
        Object.defineProperty(proto, DecoratorUtils.PROPERTY_INJECTOR, {
            value: new Injector(proto.constructor.name, allProviders),
            configurable: true,
            enumerable: true,
            writable: false,
        });
        DecoratorUtils.injectProperties(proto, injectProps);
    }

    /**
     * Check modules and return tuple of module and its metadata.
     * @param modules list of modules
     * @param target class decorated with @Module
     * @return {ModuleMetadata[]} metadata of modules
     * @throws if one of the modules is undefined or not decorated with @Module
     */
    private static checkModules(modules: Function[], target: Function): ModuleMetadata[] {
        const undefinedModules = modules.filter(m => !m);
        if (undefinedModules.length > 0) {
            throw new Error(`${target.name}: some modules are not defined. It's possible that one of the modules has` +
                ` a circular dependency with current class marked with @Component.`);
        }
        const allModuleMetadata = modules
            .filter(m => !!m)
            .map(module => [module, Reflect.getMetadata(DecoratorUtils.METADATA_MODULE, module) as ModuleMetadata]);

        // check non-modules
        const moduleMetadata = allModuleMetadata
            .filter(values => !values[1])
            .map(values => values[0] as Function);
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
     * Inject properties of instance.
     * @param instance instance of class
     * @param propMetadata injectable properties metadata
     */
    private static injectProperties(instance: any, propMetadata: InjectPropertyMetadata[]): void {
        const injector = DecoratorUtils.getInjector(instance);
        propMetadata.forEach(metadata => {
            if (!delete instance[metadata.propertyName]) {
                return;
            }
            const propInjector = PropertyInjector.newInstance(metadata, injector);
            Object.defineProperty(instance, metadata.propertyName, {
                configurable: true,
                enumerable: true,
                get: propInjector.get.bind(propInjector),
                set: propInjector.set.bind(propInjector),
            });
        });
    }

    /**
     * Get defined injector.
     * @param instance instance of class decorated with @Component decorator
     * @return {Injector} instance of defined injector
     */
    public static getInjector(instance: any): Injector {
        const injector = instance[DecoratorUtils.PROPERTY_INJECTOR] as Injector | undefined;
        if (!injector) {
            throw new Error(`${instance.name}: injector not found`);
        }
        return injector;
    }

    //noinspection JSUnusedLocalSymbols
    private constructor() {

    }
}