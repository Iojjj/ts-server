import "reflect-metadata";
import {Constants} from "../../constants";
import {RoseParameterDataBuilder} from "../../models/parameter-data.builder";
import {RosePropertyDataBuilder} from "../../models/property-data.builder";
import {RoseParameterData} from "../../models/parameter-data.bean";
import {InjectPropertyMetadata} from "../../metadata/inject-property-metadata.bean";
import {InjectPropertyMetadataBuilder} from "../../metadata/inject-property-metadata.builder";
import {ParameterMetadata} from "../../../decorators/metadata/parameter/parameter-metadata.bean";
import {ParameterMetadataBuilder} from "../../../decorators/metadata/parameter/parameter-metadata.builder";

/**
 * Decorator that allows to inject dependencies. It could be used on both object properties and methods' parameters.
 */
export function Inject() {
    return function (target: Object|Function, propertyName: string, index?: number) {
        if (typeof index === "number") {
            if (typeof target === "function" && propertyName === undefined) {
                propertyName = Constants.CONSTRUCTOR;
            }
            // inject parameter
            decorateParameter(target, propertyName, index);
        } else {
            // inject property
            decorateProperty(target, propertyName);
        }
    };
}

/**
 * Set method's parameter decorator metadata.
 * @param target class that contains @Inject decorator
 * @param methodName name of method where parameter must be injected
 * @param index index of injectable parameter
 */
function decorateParameter(target: any, methodName: string, index: number): void {
    // inject parameter
    let paramMetadata = Reflect
        .getMetadata(Constants.METADATA_PARAMETER, target, methodName) as ParameterMetadata;
    if (!paramMetadata) {
        paramMetadata = new ParameterMetadataBuilder()
            .setTargetName(target.constructor.name)
            .setMethodName(methodName)
            .build();
    }
    let paramTypes: any[];
    if (methodName === Constants.CONSTRUCTOR) {
        paramTypes = Reflect.getMetadata("design:paramtypes", target) as any[];
    } else {
        paramTypes = Reflect.getMetadata("design:paramtypes", target, methodName) as any[];
    }
    const returnType = paramTypes[index];
    let param = paramMetadata.parameters.find(p => p.index === index) as RoseParameterData;
    if (!param) {
        param = new RoseParameterDataBuilder()
            .build();
    }
    param = param.newBuilder()
        .setIndex(index)
        .setType(returnType)
        .build();
    paramMetadata = paramMetadata.newBuilder()
        .addParameter(param)
        .setTotalArgsCount(paramTypes.length)
        .build();
    Reflect.defineMetadata(Constants.METADATA_PARAMETER, paramMetadata, target, methodName);
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
    const returnType = Reflect.getMetadata("design:type", target, propertyName) as any;
    data = data.newBuilder()
        .setType(returnType)
        .build();
    propMetadata = propMetadata.newBuilder()
        .setPropertyData(data)
        .build();
    Reflect.defineMetadata(key, propMetadata, target);
}