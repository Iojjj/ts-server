import e = require("express");
import {Module} from "../../../di/decorators/class.module.decorator";
import {Provides} from "../../../di/decorators/method.provides.decorator";
import {ExpressRouterAdapter} from "../../models/express-router.adapter";

/**
 * @internal
 */
@Module()
export class ExpressDriverModule {

    //noinspection JSUnusedGlobalSymbols
    @Provides("express.app")
    public static provideApp(): e.Application {
        return e();
    }

    //noinspection JSUnusedGlobalSymbols
    @Provides()
    public static provideRouterAdapter(): ExpressRouterAdapter {
        return new ExpressRouterAdapter();
    }

    //noinspection JSUnusedLocalSymbols
    private constructor() {

    }
}