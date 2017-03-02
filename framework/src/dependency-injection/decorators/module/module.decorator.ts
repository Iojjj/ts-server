import "reflect-metadata";
import {Constants} from "../../constants";
import {ModuleMetadataBuilder} from "../../metadata/module-metadata.builder";
import {ProvidesMetadata} from "../../metadata/provides-metadata.bean";

/**
 * Decorator that tells Rose that this class is a module and provides some dependency injections.
 */
export function Module() {
    return function (target: Function) {
        const providers = Object.keys(target)
            .map(key => Reflect.getMetadata(Constants.METADATA_MODULE_PROVIDES, target, key) as ProvidesMetadata)
            .filter(m => !!m)
            .map(m => {
                if (m.isSingleton) {
                    const method = wrapSingleton(m.method);
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
        Reflect.defineMetadata(Constants.METADATA_MODULE, metadata, target);
    };
}

/**
 * Wrap function so now it will return a single instance of value.
 * @param f any function that returns a value
 * @return {()=>any} new function that returns a single instance of object
 */
function wrapSingleton(f: Function): Function {
    let value: any;
    return () => {
        if (value === undefined) {
            value = f();
        }
        return value;
    };
}