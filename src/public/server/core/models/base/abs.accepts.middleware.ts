import {SimpleMiddleware} from "./abs.middleware";

export abstract class AcceptsMiddleware extends SimpleMiddleware {

    private _values: string[];

    constructor(values: string[]) {
        super();
        this._values = values;
    }

    public get values(): string[] {
        return this._values;
    }
}