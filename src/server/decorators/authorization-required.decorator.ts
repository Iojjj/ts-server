import {DecoratorUtils} from "./internal/utils/decorator.utils";
import {MethodMetadata} from "./internal/metadata/method-metadata.bean";

export function AuthorizationRequired(): MethodDecorator {

    return function (target: Object, methodName: string) {
        const updateMethod = (metadata: MethodMetadata) => {
            return metadata.newBuilder()
                .setAuthorizationRequired(true)
                .build();
        };
        DecoratorUtils.updateMethodMetadata(target, methodName, updateMethod);
    };
}