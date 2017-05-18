import {DecoratorUtils} from "../../../internal/server/decorators/utils/decorator.utils";
import {MethodMetadata} from "../../../internal/server/decorators/metadata/method-metadata.bean";

export function AcceptsLanguages(firstLang: string, ...otherLangs: string[]): MethodDecorator {

    const langs = [firstLang, ...otherLangs];

    return function (target: Function, methodName: string) {
        const updateMethod = (metadata: MethodMetadata) => {
            return metadata.newBuilder()
                .setAcceptsLanguages(langs)
                .build();
        };
        DecoratorUtils.updateMethodMetadata(target, methodName, updateMethod);
    };
}