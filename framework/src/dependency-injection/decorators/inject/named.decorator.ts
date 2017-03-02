import {Constants} from "../../constants";
import {AnyType} from "../../../decorators/type";
import {RoseParameterDataBuilder} from "../../models/parameter-data.builder";
import {RosePropertyDataBuilder} from "../../models/property-data.builder";
import {RoseParameterData} from "../../models/parameter-data.bean";
import {InjectPropertyMetadata} from "../../metadata/inject-property-metadata.bean";
import {InjectPropertyMetadataBuilder} from "../../metadata/inject-property-metadata.builder";
import {ParameterMetadata} from "../../../decorators/metadata/parameter/parameter-metadata.bean";
import {ParameterMetadataBuilder} from "../../../decorators/metadata/parameter/parameter-metadata.builder";

/**
 * Decorator that specifies a qualifier name or type for injectable property or parameter.
 * It helps the system to understand which of providers to use if there are multiple matches for the same property
 * or parameter type.
 * @param nameOrType name or type for injectable property or parameter
 */
export function Named(nameOrType: string|AnyType) {
    return function (target: any, propertyName: string, index?: number) {
        let qualifierName = "";
        if (typeof nameOrType === "string") {
            qualifierName = nameOrType;
        } else if (typeof nameOrType === "function") {
            qualifierName = (nameOrType as any).name;
        }
        if (!qualifierName) {
            throw new Error(`${target.constructor.name}.${propertyName}: You must specify qualifier name.`);
        }

        if (typeof index === "number") {
            if (typeof target === "function" && propertyName === undefined) {
                propertyName = Constants.CONSTRUCTOR;
            }
            // inject parameter
            decorateParameter(target, propertyName, index, qualifierName);
        } else {
            // inject property
            decorateProperty(target, propertyName, qualifierName);
        }
    };
}

/**
 * Set parameter decorator metadata.
 * @param target class that contains @Named decorator
 * @param methodName name of method where parameter must be injected
 * @param index index of parameter that must be injected
 * @param qualifierName qualifier name or type of injectable parameter
 */
function decorateParameter(target: any, methodName: string, index: number, qualifierName: string): void {
    // inject parameter
    let paramMetadata = Reflect
        .getMetadata(Constants.METADATA_PARAMETER, target, methodName) as ParameterMetadata;
    if (!paramMetadata) {
        paramMetadata = new ParameterMetadataBuilder()
            .setTargetName(target.constructor.name)
            .setMethodName(methodName)
            .build();
    }
    let param = paramMetadata.parameters.find(p => p.index === index) as RoseParameterData;
    if (!param) {
        param = new RoseParameterDataBuilder()
            .build();
    }
    param = param.newBuilder()
        .setQualifierName(qualifierName)
        .setIndex(index)
        .build();
    paramMetadata = paramMetadata.newBuilder()
        .addParameter(param)
        .build();
    Reflect.defineMetadata(Constants.METADATA_PARAMETER, paramMetadata, target, methodName);
}

/**
 * Set property decorator metadata.
 * @param target class that contains @Named decorator
 * @param propertyName name of injectable property
 * @param qualifierName qualifier name or type of injectable property
 */
function decorateProperty(target: any, propertyName: string, qualifierName: string): void {
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
        .setQualifierName(qualifierName)
        .build();
    propMetadata = propMetadata.newBuilder()
        .setPropertyData(data)
        .build();
    Reflect.defineMetadata(key, propMetadata, target);
}