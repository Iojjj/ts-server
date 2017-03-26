import "reflect-metadata";
import {InjectPropertyMetadata} from "../internal/metadata/inject-property-metadata.bean";
import {InjectPropertyMetadataBuilder} from "../internal/metadata/inject-property-metadata.builder";
import {ModuleMetadata} from "../internal/metadata/module-metadata.bean";
import {ModuleMetadataBuilder} from "../internal/metadata/module-metadata.builder";
import {ProvidesMetadata} from "../internal/metadata/provides-metadata.bean";
import {ProvidesMetadataBuilder} from "../internal/metadata/provides-metadata.builder";
import {Injector} from "../internal/models/injectors/abs.injector";
import {ComponentInjector} from "../internal/models/injectors/component-injector";
import {PropertyInjector} from "../internal/models/injectors/property.injector";

/**
 * Utils that helps to decorate classes, methods and properties.
 * @internal
 */
export class DecoratorUtils {

    private static readonly METADATA_MODULE = `__module__`;
    private static readonly METADATA_MODULE_PROVIDES = `__provides__`;
    private static readonly METADATA_COMPONENT_SCOPE = `__component_scope__`;
    private static readonly PROPERTY_INJECTOR = `__injector__`;
    private static readonly CONSTRUCTOR = `__constructor__`;

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
            .filter(m => !!m);
        const metadata = new ModuleMetadataBuilder()
            .setTargetName(target.name)
            .setProviders(providers)
            .build();
        Reflect.defineMetadata(DecoratorUtils.METADATA_MODULE, metadata, target);
    }

    /**
     * Define injector for specified class.
     * @param target class that decorated with @Component decorator
     * @param modules list of modules
     */
    public static decorateComponent(target: Function, modules: Function[]): Function {
        const proto = target.prototype;
        //noinspection TsLint
        const __constructor__ = function (...args: any[]) {
            DecoratorUtils.onComponentCreated(target, this, modules);
            return target.apply(this, args);
        };
        __constructor__.prototype = proto;
        // TODO: is there any better solution?
        // we must copy all static variables
        const anyConstructor = __constructor__ as any;
        const anyTarget = target as any;
        Object.keys(target)
            .forEach(key => anyConstructor[key] = anyTarget[key]);
        return __constructor__;
    }

    private static onComponentCreated(target: Function, thiz: Object, modules: Function[]): void {
        const proto = target.prototype;
        // properties that must be injected
        let injectProps = Reflect.getOwnMetadataKeys(proto)
            .filter(key => key.startsWith("__property_"))
            .map(key => Reflect.getMetadata(key, proto) as InjectPropertyMetadata)
            .filter(m => !!m);
        const scope = DecoratorUtils.getScope(target);
        if (!!scope) {
            injectProps = injectProps.map(m => m.newBuilder()
                .setScope(scope)
                .build());
        }
        // define injector property that will inject all necessary dependencies
        Object.defineProperty(thiz, DecoratorUtils.PROPERTY_INJECTOR, {
            value: ComponentInjector.newInstance(thiz.constructor.name, modules),
            configurable: true,
            enumerable: true,
            writable: false,
        });
        DecoratorUtils.injectProperties(thiz, injectProps);
    }

    private static getScope(target: Function): symbol | undefined {
        return Reflect.getMetadata(DecoratorUtils.METADATA_COMPONENT_SCOPE, target.prototype);
    }

    public static setScope(target: Function, scope: symbol): void {
        const proto = target.prototype;
        try {
            // check if injector defined
            DecoratorUtils.getInjectorOrThrow(proto);
            Object.getOwnPropertyNames(proto)
                .map(name => proto[name])
                .filter(prop => prop instanceof PropertyInjector)
                .map(p => p as PropertyInjector)
                .forEach(p => p.updateScope(scope));
        } catch (error) {
            // injector not defined yet
            Reflect.defineMetadata(DecoratorUtils.METADATA_COMPONENT_SCOPE, scope, target.prototype);
        }
    }

    public static getQualifier(target: Object | Function, propertyName: string,
                               qualifier: string | number | symbol): symbol {
        let symbolQualifier: symbol;
        if (typeof qualifier === "string") {
            symbolQualifier = Symbol.for(qualifier);
        } else if (typeof qualifier === "number") {
            symbolQualifier = Symbol.for(qualifier.toString());
        } else if (typeof qualifier === "symbol") {
            symbolQualifier = qualifier;
        } else {
            if (target instanceof Function) {
                throw new Error(`${target.name}.${propertyName}: ` +
                    `unknown type of qualifier - ${typeof qualifier}.`);
            }
            throw new Error(`${target.constructor.name}.${propertyName}: ` +
                `unknown type of qualifier - ${typeof qualifier}.`);
        }
        return symbolQualifier;
    }

    /**
     * Get module metadata or throw an error.
     * @param targetName name of class decorated with @Module
     * @param module single module class
     * @return {ModuleMetadata[]} metadata of modules
     * @throws if one of the modules is undefined or not decorated with @Module
     */
    public static getModuleMetadataOrThrow(targetName: string, module: Function): ModuleMetadata {
        if (!module) {
            throw new Error(`${targetName}: some modules are not defined. It's possible that one of the modules has` +
                ` a circular dependency with current class marked with @Component.`);
        }
        const metadata = Reflect.getMetadata(DecoratorUtils.METADATA_MODULE, module) as ModuleMetadata;
        if (!metadata) {
            throw new Error(`${targetName}: "${module.name}" is not decorated with @Module decorator.`);
        }
        return metadata;
    }

    /**
     * Inject properties of instance.
     * @param instance instance of class
     * @param propMetadata injectable properties metadata
     */
    private static injectProperties(instance: any, propMetadata: InjectPropertyMetadata[]): void {
        const injector = DecoratorUtils.getInjectorOrThrow(instance);
        const scope = DecoratorUtils.getScope(instance.constructor);
        propMetadata.forEach(metadata => {
            if (scope) {
                metadata = metadata.newBuilder()
                    .setScope(scope)
                    .build();
            }
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
    public static getInjectorOrThrow(instance: any): Injector {
        const injector = instance[DecoratorUtils.PROPERTY_INJECTOR] as Injector | undefined;
        if (!injector) {
            throw new Error(`${instance.constructor.name}: injector not found.`);
        }
        return injector;
    }

    public static unwrapType(type: Function): Function {
        if (type.name === DecoratorUtils.CONSTRUCTOR) {
            return DecoratorUtils.unwrapType(type.prototype.constructor);
        }
        return type;
    }

    //noinspection JSUnusedLocalSymbols
    private constructor() {

    }
}