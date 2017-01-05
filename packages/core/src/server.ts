import {Driver} from "./server.driver";
import {DecoratorFactory} from "./decorators/decorator.factory";
import {ServerDecoratorOptions} from "./decorators/server.decorator";
import {ControllerMetadata, ControllerMetadataImpl} from "./decorators/controller.metadata";
import {ClassDecoratorService} from "./decorators/decorator.class";
import * as glob from "glob";
import * as path from "path";
import "reflect-metadata";
import {Logger} from "./logger";

/**
 * Abstract implementation of server.
 */
export abstract class Server<T> {

    private static readonly FORMATS = [".js", ".ts"];

    private readonly _driver: Driver<T, any>;

    protected constructor(driver: Driver<T, any>) {
        this._driver = driver;
    }

    protected get app(): T {
        return this._driver.application;
    }

    protected onBeforeInitialization(app: T): void {

    }

    protected onAfterInitialization(app: T): void {

    }

    protected onServerStarted(port: number, hostname: string): void {
        Logger.console().log(`server started at ${hostname}:${port}`);
    }

    public start(): void;
    public start(port: number): void;
    public start(port: number, hostname: string): void;
    public start(port?: number, hostname?: string): void {

        this.onBeforeInitialization(this.app);
        this.configureServer(this, this._driver);
        this.onAfterInitialization(this.app);

        //this._driver.start(port, hostname, this.onServerStarted);
    }

    public configureServer<T>(server: Server<T>, driver: Driver<T, any>): void {
        const options = DecoratorFactory.newServerDecoratorService().get(server.constructor);
        const controllers = this.loadControllers(options);
        driver.configureApp(options, controllers);
    }

    private loadControllers(options: ServerDecoratorOptions): ControllerMetadata[] {
        if (options.controllers) {
            const controllerService = DecoratorFactory.newControllerDecoratorService();
            return options.controllers
                .map((val: {[version: string]: string[]}) => {
                    return Object.keys(val)
                        .map(version => this.loadController(controllerService, options.routePrefix || "", version, val[version]));
                })
                .reduce((all, single) => all.concat(single), [] as ControllerMetadata[][])
                .reduce((all, single) => all.concat(single), [] as ControllerMetadata[]);
        }
        return [];
    }

    private loadController(controllerService: ClassDecoratorService<Function, ControllerMetadata>,
                           prefix: string, version: string, files: string[]): ControllerMetadata[] {
        const allFiles = files.reduce(
            (allFiles, file) => {
                const filePath = path.normalize(file);
                return allFiles.concat(glob.sync(filePath));
            },
            [] as string[]
        );
        return allFiles
            .filter(file => {
                const dtsExtension = file.substring(file.length - 5, file.length);
                return Server.FORMATS.indexOf(path.extname(file)) !== -1 && dtsExtension !== ".d.ts";
            })
            .map(file => require(file))
            .map(exported => exported.default)
            .map(constructor => controllerService.get(constructor) as ControllerMetadataImpl)
            .map(metadata => {
                metadata.version = version;
                metadata.prefix = prefix;
                return metadata;
            });
    }
}