import {Driver} from "./server.driver";
import {Options} from "./server.options";
import {Decorator} from "./decorators/decorator";

export abstract class Server<T> {

    private _driver: Driver<T>;
    private _options: Options;

    protected set driver(driver: Driver<T>) {
        this._driver = driver;
    }

    protected set options(options: Options | undefined) {
        this._options = options || this.defaultOptions();
    }

    protected get app(): T {
        return this._driver.application;
    }

    // noinspection JSMethodCanBeStatic
    protected defaultOptions(): Options {
        return {};
    }

    protected onBeforeInitialization(app: T): void {

    }

    protected onAfterInitialization(app: T): void {

    }

    protected onServerStarted(port: number, hostname: string): void {
        console.log(`server started at ${hostname}:${port}`);
    }

    public start(): void;
    public start(port: number): void;
    public start(port: number, hostname: string): void;
    public start(port?: number, hostname?: string): void {

        this.onBeforeInitialization(this.app);
        this.initializeApp();
        this.onAfterInitialization(this.app);

        //this._driver.start(port, hostname, this.onServerStarted);
    }

    private initializeApp(): void {
        Decorator.configureServer(this, this._driver);
    }
}