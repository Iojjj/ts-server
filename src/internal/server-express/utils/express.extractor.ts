import {ParameterExtractor} from "../../../public/server/core/models/types/parameter-extractor.type";
import {
    BodyExtractor,
    ErrorExtractor,
    NextExtractor,
    ParamExtractor,
    QueryExtractor,
    RequestExtractor,
    ResponseExtractor,
    ResultExtractor
} from "./extractor.utils";
import e = require("express");

/**
 * @internal
 */
export namespace ExpressExtractor {

    export const PARAMETER = (paramName: string): ParameterExtractor => {
        return new ParamExtractor(paramName);
    };
    export const QUERY = (paramName: string): ParameterExtractor => {
        return new QueryExtractor(paramName);
    };
    export const REQUEST = new RequestExtractor();
    export const RESPONSE = new ResponseExtractor();
    export const BODY = new BodyExtractor();
    export const ERROR = new ErrorExtractor();
    export const NEXT = new NextExtractor();
    export const RESULT = new ResultExtractor();

}