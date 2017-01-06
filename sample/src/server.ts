import * as path from "path";
import {Server} from "../../packages/core/src/decorators/server.decorator";
import {ExpressServer} from "../../packages/express/src/express.server";

@Server({
    routePrefix: "/api",
    trustProxy: true,
    caseSensitiveRouting: true,
    viewEngine: {
        "hbs": () => {
        },
    },
    views: [],
    viewCache: true,
    controllers: [
        { "v1": [path.join(__dirname, "controller.js")] },
        { "v2": [path.join(__dirname, "controller2.js")] }
    ]
})
export class ServerImpl extends ExpressServer {

}