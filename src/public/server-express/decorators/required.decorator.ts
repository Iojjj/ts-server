import {DecoratorUtils} from "../../../internal/server/decorators/utils/decorator.utils";
import {ParameterData} from "../../../internal/server/decorators/metadata/parameters-metadata.bean";

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