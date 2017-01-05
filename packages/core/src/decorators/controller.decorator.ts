import {RouteType} from "../server.types";
import {DecoratorFactory} from "./decorator.factory";
import {ControllerMetadataImpl} from "./controller.metadata";

/**
 * Decorator that tells server to treat decorated class as controller.
 * @param route controller's route
 * @returns {(target:any)=>void}
 */
export function Controller(route?: RouteType) {
    return function (target: any) {
        const metadata = new ControllerMetadataImpl();
        metadata.route = route || "";
        DecoratorFactory.newControllerDecoratorService().define(target, metadata);
    }
}