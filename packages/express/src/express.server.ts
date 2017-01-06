import express = require("express");
import {ExpressDriver} from "./express.driver";
import {AbstractServer} from "../../core/src/server";

/**
 * Implementation of server based on express.js.
 */
export abstract class ExpressServer extends AbstractServer<express.Application> {

    public constructor();
    public constructor(app: express.Application);
    public constructor(app?: express.Application) {
        super(new ExpressDriver(app));
    }
}