import "reflect-metadata";
import {Constants} from "../../constants";
import {AnyType} from "../../../decorators/type";
import {ProvidesMetadata} from "../../metadata/provides-metadata.bean";
import {ProvidesMetadataBuilder} from "../../metadata/provides-metadata.builder";

/**
 * Decorator for methods of a module that tells Rose this method is a provider.
 * @param qualifierName qualifier name or type for provider that will be used for matching {@link Named}
 */
export function Provides(qualifierName?: string|AnyType) {
    
    //noinspection JSUnusedLocalSymbols
    return function (target: Function, methodName: string, descriptor: PropertyDescriptor) {
        const returnType = Reflect.getMetadata("design:returntype", target, methodName);
        if (!returnType) {
            throw new Error(`${target.constructor.name}.${methodName}: Returned type can't be "void" or "any".`);
        }
        let type: AnyType;
        let qName: string;
        if (returnType.name === "Object" || returnType.name === "Function") {
            // interface or anonymous types
            if (!qualifierName) {
                throw new Error(`${target.constructor.name}.${methodName}: Return type "${returnType}"` +
                    `is not a valid return type. You must specify type of end-class or set qualification name.`);
            }

        }
        type = returnType;
        if (typeof qualifierName === "function") {
            qName = qualifierName.name;
        } else {
            qName = qualifierName || "";
        }

        let metadata = Reflect.getMetadata(Constants.METADATA_MODULE_PROVIDES, target, methodName) as ProvidesMetadata;
        if (!metadata) {
            metadata = new ProvidesMetadataBuilder()
                .setTargetName(target.constructor.name)
                .setMethodName(methodName)
                .build();
        }
        metadata = metadata.newBuilder()
            .setType(type)
            .setQualifierName(qName)
            .setMethod((target as any)[methodName])
            .build();

        Reflect.defineMetadata(Constants.METADATA_MODULE_PROVIDES, metadata, target, methodName);
    };
}