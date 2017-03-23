import {Bean} from "../../../../common/beans/abs.bean";
import {MethodType} from "../../../core/models/types/method-type";
import {ResponseType} from "../../../core/models/types/response-type";
import {Route} from "../../../core/models/types/route.type";
import {RouteConfigurationBuilder} from "./route-configuration.builder";

/**
 * @internal
 */
export class RouteConfiguration extends Bean<RouteConfigurationBuilder> {

    public readonly route: Route;
    public readonly type: MethodType;
    public readonly responseType: ResponseType;

    public constructor(builder: RouteConfigurationBuilder) {
        super(builder);
        this.route = builder.route;
        this.type = builder.type;
        this.responseType = builder.responseType;
    }

    public newBuilder(): RouteConfigurationBuilder {
        return new RouteConfigurationBuilder(this);
    }
}