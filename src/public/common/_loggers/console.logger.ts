import LabeledLogger from "./abs.labeled.logger";

/**
 * Implementation of {@link LabeledLogger} that write logs to console.
 */
export class ConsoleLogger extends LabeledLogger {

    /**
     * Create a new instance with provided label.
     * @param label label to be used in logs
     * @return {ConsoleLogger} a new instance of logger
     */
    public static newInstance(label: string): ConsoleLogger {
        return new ConsoleLogger(label);
    }

    private constructor(label: string) {
        super(label);
    }

    protected dImpl(firstParam: any, ...otherParams: any[]): void {
        console.log(firstParam, ...otherParams);
    }

    protected iImpl(firstParam: any, ...otherParams: any[]): void {
        console.info(firstParam, ...otherParams);
    }

    protected wImpl(firstParam: any, ...otherParams: any[]): void {
        console.warn(firstParam, ...otherParams);
    }

    protected eImpl(firstParam: any, ...otherParams: any[]): void {
        console.error(firstParam, ...otherParams);
    }

}