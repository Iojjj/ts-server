import {Route} from "../../models/types/route.type";
import {RouteUtils} from "./route.utils";

/**
 * @internal
 */
export class RouteUtilsImpl implements RouteUtils {

    public isRoute(val: any): val is Route {
        if (!val) {
            return false;
        }
        return RouteUtilsImpl.isString(val) || RouteUtilsImpl.isRegExp(val);
    }

    public constructRoute(part: Route, ...otherParts: Route[]): Route {
        let isRegExp = false;
        const parts = [part, ...otherParts]
            .map((part: Route) => {
                if (RouteUtilsImpl.isString(part) && !part.startsWith("/")) {
                    part = "/" + part;
                } else if (RouteUtilsImpl.isRegExp(part)) {
                    let str = part.toString();
                    if (str.startsWith("/")) {
                        str = str.substring(1);
                    }
                    if (str.endsWith("/") && !str.endsWith("\\/")) {
                        str = str.substring(0, str.length - 1);
                    }
                    isRegExp = true;
                    part = str;
                }
                return part;
            });
        if (isRegExp) {
            return new RegExp(parts.join("\/"));
        }
        return parts.join("");
    }

    private static isString(val: any): val is string {
        return typeof val === "string";
    }

    private static isRegExp(val: any): val is RegExp {
        return val instanceof RegExp;
    }
}