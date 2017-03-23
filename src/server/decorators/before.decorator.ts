import {SimpleMiddleware} from "../core/models/base/abs.middleware";
import {DecoratorUtils} from "./internal/utils/decorator.utils";
import {MethodMetadata} from "./internal/metadata/method-metadata.bean";

export function Before(firstMiddleware: SimpleMiddleware, ...middlewares: SimpleMiddleware[]): MethodDecorator {

    middlewares = [firstMiddleware, ...middlewares];

    return function (target: Object, methodName: string) {
        const updateMethod = (metadata: MethodMetadata) => {
            return metadata.newBuilder()
                .setBeforeMiddlewares(middlewares)
                .build();
        };
        DecoratorUtils.updateMethodMetadata(target, methodName, updateMethod);
    };
}