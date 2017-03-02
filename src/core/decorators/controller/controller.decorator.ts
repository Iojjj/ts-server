import {RouteType, ResponseType} from "../../server.types";
import {DecoratorFactory} from "../factory/decorator.factory";
import {ControllerMetadataBuilder} from "./controller.metadata";

const DEFAULT_RESPONSE_TYPE = "raw";

/**
 * Decorator that tells server to treat decorated class as controller.
 * @param options controller's options
 * @returns {(target:any)=>void}
 */
export function Controller(options?: ControllerOptions) {
    return function (target: Function) {
        const metadata = new ControllerMetadataBuilder()
            .setTargetName(target.constructor.name)
            .setRoute(!!options ? options.route || "" : "")
            .setPrefix(!!options ? options.routePrefix || "" : "")
            .setVersion(!!options ? options.version || "" : "")
            .setDefaultResponseType(!!options ? options.defaultResponseType || DEFAULT_RESPONSE_TYPE :
                DEFAULT_RESPONSE_TYPE)
            .build();
        DecoratorFactory.newControllerDecoratorService().define(target, metadata);
    };
}

export interface ControllerOptions {

    /**
     * Controller's route. For example, <code>/users</code>.
     */
    route?: RouteType;

    /**
     * Route prefix for current controller. This option will override global route prefix.
     */
    routePrefix?: string;

    /**
     * Version of this controller. This option will be used as a part of route. For example,
     * <code>/api/1.0/users</code>
     * <code>/api/v1/users</code>
     * <code>/api/v1.0/users</code>
     */
    version?: string;

    /**
     * Default response type. Default value: raw.
     */
    defaultResponseType?: ResponseType;
}