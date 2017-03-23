import {Route} from "../../models/types/route.type";

/**
 * @internal
 */
export abstract class RouteUtils {
    public abstract isRoute(val: any): val is Route;

    public abstract constructRoute(part: Route, ...otherParts: Route[]): Route;
}