import {ExpressServer} from "../../express/src/express.server";
import {Server} from "../../core/src/decorators/server.decorator";
import * as path from "path";

@Server({
    routePrefix: "/api",
    trustProxy: true,
    caseSensitiveRouting: true,
    viewEngine: {
        "hbs": () => {
        }
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