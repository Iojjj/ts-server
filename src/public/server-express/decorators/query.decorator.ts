import {DecoratorUtils} from "../../../internal/server/decorators/utils/decorator.utils";
import {ParameterData} from "../../../internal/server/decorators/metadata/parameters-metadata.bean";
import {ExpressExtractor} from "../../../internal/server-express/utils/express.extractor";

export function Query(name: string): ParameterDecorator {

    return function (target: Object, methodName: string, index: number) {
        if (!name) {
            throw new Error(`${target.constructor.name}.${methodName}: specify parameter name for parameter at index `
                + `${index}.`);
        }
        const updateParam = (param: ParameterData) => {
            return param.newBuilder()
                .setInjectType(ExpressExtractor.QUERY(name))
                .setInjectName(name)
                .build();
        };
        DecoratorUtils.decorateParameter(target, methodName, index,
            "injecting query into constructor is not allowed", updateParam);
    };
}