import {RouteType} from "./http-method.decorators";
import {HttpMethodName} from "./http-method.names";
import {Driver} from "../server.driver";

export interface HttpMethodMetadata {
    route: RouteType;
    actionName: HttpMethodName;
    action: (req: any, res: any, next: any, driver: Driver<any, any>) => void | PromiseLike<any>;
    returnType: any;
}