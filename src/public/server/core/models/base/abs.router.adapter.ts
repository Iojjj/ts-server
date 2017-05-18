import {MethodType} from "../types/method-type";
import {Route} from "../types/route.type";
import {SimpleMiddleware} from "./abs.middleware";

export abstract class RouterAdapter {

    public abstract registerRoute(methodType: MethodType, route: Route, middleware: SimpleMiddleware): void;
}