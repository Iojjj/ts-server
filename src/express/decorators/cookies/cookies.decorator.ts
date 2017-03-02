import {defineParameter} from "../../../../core/decorators/parameters/param.decorator";
import {ExpressParameters} from "../../express.param.types";

export function Cookie(paramName: string, nullValue?: any, undefinedValue?: any) {
    return defineParameter(ExpressParameters.COOKIES, paramName, nullValue, undefinedValue);
}

export function Cookies() {
    return defineParameter(ExpressParameters.COOKIES);
}

export function SignedCookie(paramName: string, nullValue?: any, undefinedValue?: any) {
    return defineParameter(ExpressParameters.SIGNED_COOKIES, paramName, nullValue, undefinedValue);
}

export function SignedCookies() {
    return defineParameter(ExpressParameters.SIGNED_COOKIES);
}