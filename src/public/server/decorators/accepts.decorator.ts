import {DecoratorUtils} from "../../../internal/server/decorators/utils/decorator.utils";
import {MethodMetadata} from "../../../internal/server/decorators/metadata/method-metadata.bean";

export function Accepts(firstType: string, ...otherTypes: string[]): MethodDecorator {

    const types = [firstType, ...otherTypes];

    return function (target: Function, methodName: string) {
        const updateMethod = (metadata: MethodMetadata) => {
            return metadata.newBuilder()
                .setAcceptsTypes(types)
                .build();
        };
        DecoratorUtils.updateMethodMetadata(target, methodName, updateMethod);
    };
}