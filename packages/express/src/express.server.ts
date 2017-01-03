import express = require("express");
import {Server} from "../../core/src/server";
import {ExpressDriver} from "./express.driver";
import {Options} from "../../core/src/server.options";

export class ExpressServer extends Server<express.Application> {

    public constructor();
    public constructor(app: express.Application, options?: Options);
    public constructor(options: Options);

    public constructor(app?: express.Application|Options, options?: Options) {
        super();
        if (!app) {
            this.driver = new ExpressDriver();
            this.options = undefined;
        } else if (ExpressServer.isExpressApp(app)) {
            this.driver = new ExpressDriver(app);
            this.options = options;
        } else {
            this.driver = new ExpressDriver();
            this.options = app;
        }
    }

    private static isExpressApp(app: express.Application | Options): app is express.Application {
        return (app as express.Application).init !== undefined;
    }
}