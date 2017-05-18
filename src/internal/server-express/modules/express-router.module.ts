import e = require("express");
import {Module} from "../../../public/di/decorators/class.module.decorator";
import {Provides} from "../../../public/di/decorators/method.provides.decorator";

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