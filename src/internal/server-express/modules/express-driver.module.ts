import e = require("express");
import {Module} from "../../../public/di/decorators/class.module.decorator";
import {Provides} from "../../../public/di/decorators/method.provides.decorator";
import {ExpressRouterAdapter} from "../../../public/server-express/models/express-router.adapter";

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
    @Provides("adapter")
    public static provideRouterAdapter(): ExpressRouterAdapter {
        return new ExpressRouterAdapter();
    }

    //noinspection JSUnusedLocalSymbols
    private constructor() {

    }
}