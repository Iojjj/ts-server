export class Logger {

    private static readonly CONSOLE_INSTANCE = new Logger(console);
    private static LOGS_ENABLED = process.env.NODE_ENV !== "production";

    private readonly _logger: InnerLogger;

    public static console(): Logger {
        return Logger.CONSOLE_INSTANCE;
    }

    public static enableLogs(enable: boolean) {
        this.LOGS_ENABLED = enable;
    }

    constructor(logger: InnerLogger) {
        this._logger = logger;
    }

    public log(message: any, ...otherParams: any[]): void {
        this._logger.log(message, otherParams);
    }

    public d(message: any, ...otherParams: any[]): void {
        this._logger.debug(message, otherParams);
    }

    public w(message: any, ...otherParams: any[]): void {
        this._logger.warn(message, otherParams);
    }

    public e(message: any, ...otherParams: any[]): void {
        this._logger.error(message, otherParams);
    }

    public i(message: any, ...otherParams: any[]): void {
        this._logger.info(message, otherParams);
    }
}

export interface InnerLogger {

    log(message?: any, ...otherParams: any[]): void;
    debug(message?: any, ...otherParams: any[]): void;
    info(message?: any, ...otherParams: any[]): void;
    warn(message?: any, ...otherParams: any[]): void;
    error(message?: any, ...otherParams: any[]): void;
}