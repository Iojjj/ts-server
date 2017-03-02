import {Driver} from "./server.driver";
import {DecoratorFactory} from "./decorators/factory/decorator.factory";
import {ServerOptions} from "./decorators/server/server.options";
import {ControllerMetadata} from "./decorators/controller/controller.metadata";
import {Logger} from "./utils/logger";
import "reflect-metadata";

/**
 * Abstract implementation of server.
 */
export abstract class AbstractServer<T> {

    private readonly _driver: Driver<T>;

    protected constructor(driver: Driver<T>) {
        this._driver = driver;
    }

    protected get app(): T {
        return this._driver.application;
    }

    // noinspection JSUnusedLocalSymbols
    protected onBeforeInitialization(app: T): void {

    }

    // noinspection JSUnusedLocalSymbols
    protected onAfterInitialization(app: T): void {

    }

    // noinspection JSMethodCanBeStatic
    protected onServerStarted(port: number, hostname: string): void {
        Logger.console().d(`server started at ${hostname}:${port}`);
    }

    protected abstract provideControllers(...args: any[]): (Object|undefined)[];

    public start(): void;
    public start(port: number): void;
    public start(port: number, hostname: string): void;
    public start(port?: number, hostname?: string): void {

        this.onBeforeInitialization(this.app);
        this.configureServer(this, this._driver);
        this.onAfterInitialization(this.app);

        this._driver.start(port, hostname, this.onServerStarted);
    }

    private configureServer<T>(server: AbstractServer<T>, driver: Driver<T>): void {
        const options = DecoratorFactory.newServerDecoratorService().get(server.constructor) || {};
        const controllers = this.loadControllers(options);
        driver.configureApp(options, controllers);
    }

    private loadControllers(options: ServerOptions): ControllerMetadata[] {
        const controllerService = DecoratorFactory.newControllerDecoratorService();
        const controllers = this.provideControllers();
        const prefix = options.routePrefix || "";
        const metadataList: ControllerMetadata[] = [];
        controllers
            .forEach(controller => {
                if (!controller) {
                    return;
                }
                const metadata = controllerService.get(controller.constructor as any) as ControllerMetadata;
                if (metadata) {
                    const builder = metadata.newBuilder();
                    if (!metadata.prefix) {
                        builder.setPrefix(prefix);
                    }
                    if (!metadata.defaultResponseType) {
                        builder.setDefaultResponseType("raw");
                    }
                    metadataList.push(builder.build());
                }
            });
        return metadataList;
    }
}