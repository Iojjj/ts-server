import {SimpleMiddleware} from "../core/models/base/abs.middleware";
import {DecoratorUtils} from "../../../internal/server/decorators/utils/decorator.utils";
import {MethodMetadata} from "../../../internal/server/decorators/metadata/method-metadata.bean";

export function After(firstMiddleware: SimpleMiddleware, ...middlewares: SimpleMiddleware[]): MethodDecorator {

    middlewares = [firstMiddleware, ...middlewares];

    return function (target: Object, methodName: string) {
        const updateMethod = (metadata: MethodMetadata) => {
            return metadata.newBuilder()
                .setAfterMiddlewares(middlewares)
                .build();
        };
        DecoratorUtils.updateMethodMetadata(target, methodName, updateMethod);
    };
}