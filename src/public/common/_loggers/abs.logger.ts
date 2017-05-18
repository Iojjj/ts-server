/**
 * Interface of logger class.
 */
abstract class Logger {

    /**
     * Write to debug logs.
     * @param firstParam first parameter
     * @param otherParams other parameters
     */
    public abstract d(firstParam: any, ...otherParams: any[]): void;

    /**
     * Write to information logs.
     * @param firstParam first parameter
     * @param otherParams other parameters
     */
    public abstract i(firstParam: any, ...otherParams: any[]): void;

    /**
     * Write to warning logs.
     * @param firstParam first parameter
     * @param otherParams other parameters
     */
    public abstract w(firstParam: any, ...otherParams: any[]): void;

    /**
     * Write to error logs.
     * @param firstParam first parameter
     * @param otherParams other parameters
     */
    public abstract e(firstParam: any, ...otherParams: any[]): void;
}

export default Logger;