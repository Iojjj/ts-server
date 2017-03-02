import {Constants} from "../../constants";
import {RosePropertyDataBuilder} from "../../models/property-data.builder";
import {InjectPropertyMetadata} from "../../metadata/inject-property-metadata.bean";
import {InjectPropertyMetadataBuilder} from "../../metadata/inject-property-metadata.builder";

/**
 * Decorator that tells Rose to inject property only when it's accessed first time.
 * This decorator can be used only for properties.
 */
export function Lazy() {
    return function (target: any, propertyName: string, index?: number) {
        if (typeof index === "number") {
            if (typeof target === "function" && !propertyName) {
                throw new Error(`${target.name}.constructor: Lazy decorator can't be applied to parameters.`);
            }
            throw new Error(`${target.name}.${propertyName}: Lazy decorator can't be applied to parameters.`);
        } else {
            // inject property
            decorateProperty(target, propertyName);
        }
    };
}

/**
 * Set property decorator metadata.
 * @param target class that contains @Inject decorator
 * @param propertyName name of injectable property
 */
function decorateProperty(target: any, propertyName: string): void {
    const key = `${Constants.METADATA_PROPERTY}${propertyName}`;
    let propMetadata = Reflect.getMetadata(key, target) as InjectPropertyMetadata;
    if (!propMetadata) {
        propMetadata = new InjectPropertyMetadataBuilder()
            .setTargetName(target.constructor.name)
            .build();
    }
    let data = propMetadata.propertyData;
    if (!data) {
        data = new RosePropertyDataBuilder()
            .setPropertyName(propertyName)
            .build();
    }
    data = data.newBuilder()
        .setLazy(true)
        .build();
    propMetadata = propMetadata.newBuilder()
        .setPropertyData(data)
        .build();
    Reflect.defineMetadata(key, propMetadata, target);
}