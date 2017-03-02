import {Constants} from "../../constants";
import {ProvidesMetadataBuilder} from "../../metadata/provides-metadata.builder";
import {ProvidesMetadata} from "../../metadata/provides-metadata.bean";

/**
 * Decorator that tells Rose that provider must create onle a single instance of dependency.
 */
export function Singleton() {

    //noinspection JSUnusedLocalSymbols
    return function (target: Function, methodName: string, descriptor: PropertyDescriptor) {

        let metadata = Reflect.getMetadata(Constants.METADATA_MODULE_PROVIDES, target, methodName) as ProvidesMetadata;
        if (!metadata) {
            metadata = new ProvidesMetadataBuilder()
                .setTargetName(target.name)
                .setMethodName(methodName)
                .build();
        }
        metadata = metadata.newBuilder()
            .setSingleton(true)
            .build();

        Reflect.defineMetadata(Constants.METADATA_MODULE_PROVIDES, metadata, target, methodName);
    };
}