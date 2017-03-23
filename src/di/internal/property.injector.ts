import {InjectPropertyMetadata} from "../metadata/inject-property-metadata.bean";
import {Injector} from "./injector";

/**
 * Implementation of class that helps to inject a dependency into a single property.
 * @internal
 */
export class PropertyInjector implements PropertyDescriptor {

    private _injector: Injector;
    private _metadata: InjectPropertyMetadata;
    private _val: any;

    public static newInstance(metadata: InjectPropertyMetadata, injector: Injector): PropertyInjector {
        return new PropertyInjector(metadata, injector);
    }

    private constructor(metadata: InjectPropertyMetadata, injector: Injector) {
        this._metadata = metadata;
        this._injector = injector;
        if (!metadata.isLazy) {
            this.inject();
        }
    }

    private inject(): void {
        this._val = this._injector.inject(this._metadata.propertyName, this._metadata.type, this._metadata.qualifier);
    }

    public get(): any {
        if (!this._val) {
            this.inject();
        }
        return this._val;
    }

    public set(v: any): void {
        this._val = v;
    }
}