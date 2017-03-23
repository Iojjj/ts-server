import {DecoratorUtils} from "../../server/decorators/internal/utils/decorator.utils";
import {ParameterData} from "../../server/decorators/internal/metadata/parameters-metadata.bean";
import {ExpressExtractor} from "../internal/utils/express.extractor";

export function Req(): ParameterDecorator {

    return function (target: Object, methodName: string, index: number) {
        const updateParam = (param: ParameterData) => {
            return param.newBuilder()
                .setInjectType(ExpressExtractor.REQUEST)
                .build();
        };
        DecoratorUtils.decorateParameter(target, methodName, index,
            "injecting request into constructor is not allowed", updateParam);
    };
}