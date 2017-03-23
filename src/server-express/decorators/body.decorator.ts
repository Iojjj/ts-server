import {DecoratorUtils} from "../../server/decorators/internal/utils/decorator.utils";
import {ParameterData} from "../../server/decorators/internal/metadata/parameters-metadata.bean";
import {ExpressExtractor} from "../internal/utils/express.extractor";

export function Body(): ParameterDecorator {

    return function (target: Object, methodName: string, index: number) {
        const updateParam = (param: ParameterData) => {
            return param.newBuilder()
                .setInjectType(ExpressExtractor.BODY)
                .build();
        };
        DecoratorUtils.decorateParameter(target, methodName, index,
            "injecting body into constructor is not allowed", updateParam);
    };
}