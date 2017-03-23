import {BeanBuilder} from "../../../../common/beans/abs.bean.builder";
import {MethodType} from "../../../core/models/types/method-type";
import {ResponseType} from "../../../core/models/types/response-type";
import {Route} from "../../../core/models/types/route.type";
import {RouteConfiguration} from "./route-configuration.bean";

/**
 * @internal
 */
export class RouteConfigurationBuilder extends BeanBuilder<RouteConfigurationBuilder, RouteConfiguration> {

    private _route: Route;
    private _type: MethodType;
    private _responseType: ResponseType;

    constructor(model?: RouteConfiguration) {
        super(model);
        if (!!model) {
            this._route = model.route;
            this._type = model.type;
            this._responseType = model.responseType;
        }
    }

    public setRoute(val: Route): RouteConfigurationBuilder {
        this._route = val;
        return this;
    }

    public setType(val: MethodType): RouteConfigurationBuilder {
        this._type = val;
        return this;
    }

    public setResponseType(val: ResponseType): RouteConfigurationBuilder {
        this._responseType = val;
        return this;
    }

    public get route(): Route {
        return this._route;
    }

    public get type(): MethodType {
        return this._type;
    }

    public get responseType(): ResponseType {
        return this._responseType;
    }

    protected getThis(): RouteConfigurationBuilder {
        return this;
    }

    public build(): RouteConfiguration {
        return new RouteConfiguration(this);
    }

}