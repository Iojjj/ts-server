import "reflect-metadata";
import {TypedMetadata} from "./typed-metadata.bean";

/**
 * @internal
 */
export class DecoratorUtils {

    public static decorateProperty(target: Object, propertyName: string, metadata: TypedMetadata): void {
        const returnType = Reflect.getMetadata("design:type", target, propertyName);
        metadata = metadata.newBuilder()
            .setTargetName(target.constructor.name)
            .setPropertyName(propertyName)
            .setType(returnType)
            .build();
        const key = `__typed-property:${propertyName}__`;
        Reflect.defineMetadata(key, metadata, target);
    }

    public static decorateClass(target: Function): void {
        Reflect.defineMetadata("__typed-class__", true, target);
    }

    public static isTypedClass(type: Function): boolean {
        return Reflect.getMetadata("__typed-class__", type) === true;
    }

    public static getMetadata(type: Function): TypedMetadata[] {
        const keys = Reflect.getMetadataKeys(type.prototype)
            .filter((key: string) => key && key.startsWith("__typed-property:") && key.endsWith("__"));
        return keys.map(key => Reflect.getMetadata(key, type.prototype) as TypedMetadata);
    }

    //noinspection JSUnusedLocalSymbols
    private constructor() {

    }
}