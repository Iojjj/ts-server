import e = require("express");
import {Module} from "../../../di/decorators/class.module.decorator";
import {Provides} from "../../../di/decorators/method.provides.decorator";

/**
 * @internal
 */
@Module()
export class ExpressRouterModule {

    //noinspection JSUnusedGlobalSymbols
    @Provides("express.router")
    public static providerExpressRouter(): e.Router {
        return e.Router();
    }

    //noinspection JSUnusedLocalSymbols
    private constructor() {

    }
}