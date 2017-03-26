import {InjectPropertyMetadata} from "../../metadata/inject-property-metadata.bean";
import {Injector} from "./abs.injector";

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
        this._val = this._injector.inject(this._metadata);
    }

    public get(): any {
        if (this._val === undefined && this._metadata.isLazy) {
            this.inject();
        }
        return this._val;
    }

    public set(v: any): void {
        throw new Error("You can't rewrite an injected property.");
    }

    public updateScope(scope: symbol): void {
        this._metadata = this._metadata.newBuilder()
            .setScope(scope)
            .build();
    }
}