import {DecoratorUtils} from "../../../internal/server/decorators/utils/decorator.utils";
import {ParameterData} from "../../../internal/server/decorators/metadata/parameters-metadata.bean";
import {ExpressExtractor} from "../../../internal/server-express/utils/express.extractor";

export function Error(): ParameterDecorator {

    return function (target: Object, methodName: string, index: number) {
        const updateParam = (param: ParameterData) => {
            return param.newBuilder()
                .setInjectType(ExpressExtractor.ERROR)
                .build();
        };
        DecoratorUtils.decorateParameter(target, methodName, index,
            "injecting error into constructor is not allowed", updateParam);
    };
}