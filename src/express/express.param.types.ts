import {Parameter} from "../../core/decorators/parameters/param.types";

export namespace ExpressParameters {

    export const BODY = Parameter.create("body");
    export const QUERY = Parameter.create("query");
    export const REQUEST = Parameter.create("req");
    export const RESPONSE = Parameter.create("res");
    export const HEADERS = Parameter.create("headers");
    export const PATH = Parameter.create("params");
    export const SESSION = Parameter.create("session");
    export const COOKIES = Parameter.create("cookies");
    export const SIGNED_COOKIES = Parameter.create("signedCookies");

    export const REQUIRED_PARAM_NAMES = [QUERY, PATH];
}