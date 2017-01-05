import express = require("express");
import {Server} from "../../core/src/server";
import {ExpressDriver} from "./express.driver";

/**
 * Implementation of server based on express.js.
 */
export abstract class ExpressServer extends Server<express.Application> {

    public constructor();
    public constructor(app: express.Application);
    public constructor(app?: express.Application) {
        super(new ExpressDriver(app));
    }
}