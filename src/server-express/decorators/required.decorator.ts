import {DecoratorUtils} from "../../server/decorators/internal/utils/decorator.utils";
import {ParameterData} from "../../server/decorators/internal/metadata/parameters-metadata.bean";

export function Required(): ParameterDecorator {

    return function (target: Object, methodName: string, index: number) {
        const updateParam = (param: ParameterData) => {
            return param.newBuilder()
                .setRequired(true)
                .build();
        };
        DecoratorUtils.decorateParameter(target, methodName, index,
            "@Required decorator is not allowed in constructor", updateParam);
    };
}