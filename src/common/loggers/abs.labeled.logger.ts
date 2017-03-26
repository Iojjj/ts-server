import {Component} from "../../di/decorators/class.component.decorator";
import {Inject} from "../../di/decorators/prop.inject.decorator";
import {Provider} from "../../di/models/abs.provider";
import {Logger} from "./abs.logger";
import {LoggerModule} from "./internal/logger.module";

/**
 * Implementation of logger that displays a label as first parameter.
 */
@Component(LoggerModule)
export abstract class LabeledLogger extends Logger {

    @Inject("labeled-logger.date")
    private readonly _dateProvider: Provider<Date>;

    private readonly _label: string;

    constructor(label: string) {
        super();
        this._label = label;
    }

    /**
     * @inheritDoc
     */
    public d(firstParam: any, ...otherParams: any[]): void {
        otherParams = [firstParam, ...otherParams];
        this.dImpl(this.getDateTime(), this._label, ...otherParams);
    }

    /**
     * @inheritDoc
     */
    public i(firstParam: any, ...otherParams: any[]): void {
        otherParams = [firstParam, ...otherParams];
        this.iImpl(this.getDateTime(), this._label, ...otherParams);
    }

    /**
     * @inheritDoc
     */
    public w(firstParam: any, ...otherParams: any[]): void {
        otherParams = [firstParam, ...otherParams];
        this.wImpl(this.getDateTime(), this._label, ...otherParams);
    }

    /**
     * @inheritDoc
     */
    public e(firstParam: any, ...otherParams: any[]): void {
        otherParams = [firstParam, ...otherParams];
        this.eImpl(this.getDateTime(), this._label, ...otherParams);
    }

    private getDateTime(): string {
        const date = this._dateProvider.get();
        return `[${date.toLocaleString()}]`;
    }

    /**
     * Inheritors must write to debug logs.
     * @param firstParam first parameter
     * @param otherParams other parameters
     */
    protected abstract dImpl(firstParam: any, ...otherParams: any[]): void;

    /**
     * Inheritors must write to information logs.
     * @param firstParam first parameter
     * @param otherParams other parameters
     */
    protected abstract iImpl(firstParam: any, ...otherParams: any[]): void;

    /**
     * Inheritors must write to warning logs.
     * @param firstParam first parameter
     * @param otherParams other parameters
     */
    protected abstract wImpl(firstParam: any, ...otherParams: any[]): void;

    /**
     * Inheritors must write to error logs.
     * @param firstParam first parameter
     * @param otherParams other parameters
     */
    protected abstract eImpl(firstParam: any, ...otherParams: any[]): void;
}