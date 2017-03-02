import {defineParameter} from "../../../../core/decorators/parameters/param.decorator";
import {Parameter} from "../../../../core/decorators/parameters/param.types";

export function Session(paramName?: string, nullValue?: any, undefinedValue?: any) {
    return defineParameter(Parameter.SESSION, paramName, nullValue, undefinedValue);
}
